"""
ML Platform Backend API - Flask Server with Machine Learning Algorithms
This script creates a REST API for machine learning operations
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import io
import base64
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.linear_model import LinearRegression, LogisticRegression, Ridge, Lasso
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor, plot_tree
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.naive_bayes import GaussianNB
from sklearn.svm import SVC, SVR
from sklearn.neighbors import KNeighborsClassifier, KNeighborsRegressor
from sklearn.cluster import KMeans
from sklearn.neural_network import MLPClassifier, MLPRegressor
from sklearn.preprocessing import PolynomialFeatures
from sklearn.metrics import (accuracy_score, precision_score, recall_score, f1_score,
                             mean_squared_error, r2_score, mean_absolute_error,
                             confusion_matrix, silhouette_score, classification_report,
                             roc_curve, auc, roc_auc_score)
from sklearn.pipeline import Pipeline
import uuid

app = Flask(__name__)
CORS(app)

# Global storage for datasets and models
datasets = {}
trained_models = {}

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "message": "ML API is running"})

@app.route('/api/upload-dataset', methods=['POST'])
def upload_dataset():
    """Upload and parse dataset (CSV format)"""
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400
        
        file = request.files['file']
        dataset_id = request.form.get('dataset_id', 'default')
        
        # Read CSV
        df = pd.read_csv(file)
        
        # Store dataset
        datasets[dataset_id] = df
        
        # Get basic statistics
        stats = {
            "shape": df.shape,
            "columns": df.columns.tolist(),
            "dtypes": df.dtypes.astype(str).to_dict(),
            "missing_values": df.isnull().sum().to_dict(),
            "numeric_columns": df.select_dtypes(include=[np.number]).columns.tolist(),
            "categorical_columns": df.select_dtypes(include=['object']).columns.tolist(),
            "head": df.head(10).to_dict('records'),
            "statistics": df.describe().to_dict()
        }
        
        return jsonify({
            "message": "Dataset uploaded successfully",
            "dataset_id": dataset_id,
            "stats": stats
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/preprocess', methods=['POST'])
def preprocess_data():
    """Preprocess dataset: handle missing values, normalize, encode"""
    try:
        data = request.json
        dataset_id = data.get('dataset_id', 'default')
        operations = data.get('operations', {})
        
        if dataset_id not in datasets:
            return jsonify({"error": "Dataset not found"}), 404
        
        df = datasets[dataset_id].copy()
        
        # Handle missing values
        if operations.get('handle_missing') == 'drop':
            df = df.dropna()
        elif operations.get('handle_missing') == 'mean':
            numeric_cols = df.select_dtypes(include=[np.number]).columns
            df[numeric_cols] = df[numeric_cols].fillna(df[numeric_cols].mean())
        elif operations.get('handle_missing') == 'median':
            numeric_cols = df.select_dtypes(include=[np.number]).columns
            df[numeric_cols] = df[numeric_cols].fillna(df[numeric_cols].median())
        elif operations.get('handle_missing') == 'mode':
            for col in df.columns:
                df[col] = df[col].fillna(df[col].mode()[0] if not df[col].mode().empty else df[col])
        
        # Encode categorical variables
        if operations.get('encode_categorical'):
            categorical_cols = df.select_dtypes(include=['object']).columns
            for col in categorical_cols:
                le = LabelEncoder()
                df[col] = le.fit_transform(df[col].astype(str))
        
        # Normalize/Standardize
        if operations.get('normalize'):
            numeric_cols = df.select_dtypes(include=[np.number]).columns
            scaler = StandardScaler()
            df[numeric_cols] = scaler.fit_transform(df[numeric_cols])
        
        # Store preprocessed dataset
        preprocessed_id = f"{dataset_id}_preprocessed"
        datasets[preprocessed_id] = df
        
        return jsonify({
            "message": "Data preprocessed successfully",
            "dataset_id": preprocessed_id,
            "shape": df.shape,
            "head": df.head(10).to_dict('records')
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/visualize', methods=['POST'])
def visualize_data():
    """Generate data visualizations"""
    try:
        data = request.json
        dataset_id = data.get('dataset_id', 'default')
        viz_type = data.get('type', 'correlation')
        columns = data.get('columns', [])
        
        if dataset_id not in datasets:
            return jsonify({"error": "Dataset not found"}), 404
        
        df = datasets[dataset_id]
        
        plt.figure(figsize=(10, 8))
        
        if viz_type == 'correlation':
            numeric_df = df.select_dtypes(include=[np.number])
            if not numeric_df.empty:
                correlation = numeric_df.corr()
                sns.heatmap(correlation, annot=True, fmt='.2f', cmap='coolwarm', center=0, 
                           square=True, linewidths=0.5, cbar_kws={"shrink": 0.8})
                plt.title('Correlation Matrix', fontsize=14, fontweight='bold')
                plt.tight_layout()
        
        elif viz_type == 'distribution' and columns:
            col = columns[0]
            if col in df.columns:
                if df[col].dtype in [np.float64, np.int64]:
                    plt.hist(df[col], bins=30, edgecolor='black', alpha=0.7, color='steelblue')
                    plt.title(f'Distribution of {col}', fontsize=14, fontweight='bold')
                    plt.xlabel(col, fontsize=12)
                    plt.ylabel('Frequency', fontsize=12)
                    plt.grid(axis='y', alpha=0.3)
        
        elif viz_type == 'scatter' and len(columns) >= 2:
            if columns[0] in df.columns and columns[1] in df.columns:
                plt.scatter(df[columns[0]], df[columns[1]], alpha=0.6, s=100, 
                           edgecolors='black', linewidth=0.5, color='steelblue')
                plt.xlabel(columns[0], fontsize=12)
                plt.ylabel(columns[1], fontsize=12)
                plt.title(f'{columns[0]} vs {columns[1]}', fontsize=14, fontweight='bold')
                plt.grid(True, alpha=0.3)
        
        # Convert plot to base64
        buffer = io.BytesIO()
        plt.savefig(buffer, format='png', bbox_inches='tight', dpi=100)
        buffer.seek(0)
        image_base64 = base64.b64encode(buffer.read()).decode()
        plt.close()
        
        return jsonify({
            "image": f"data:image/png;base64,{image_base64}"
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/train', methods=['POST'])
def train_model():
    """Train machine learning model"""
    try:
        data = request.json
        dataset_id = data['dataset_id']
        algorithm = data['algorithm']
        target_column = data['target_column']
        test_size = data.get('test_size', 0.2)
        
        if dataset_id not in datasets:
            return jsonify({'error': 'Dataset not found'}), 404
        
        df = datasets[dataset_id]
        
        # Prepare data
        X = df.drop(columns=[target_column])
        y = df[target_column]
        
        # Store feature names for visualization
        feature_columns = X.columns.tolist()
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size, random_state=42)
        
        # Determine model type
        model_type = 'regression'
        if algorithm in ['logistic_regression', 'naive_bayes', 'svm_classification', 'knn_classification', 
                          'decision_tree_classification', 'random_forest_classification', 'neural_network_classification']:
            model_type = 'classification'
        elif algorithm == 'kmeans':
            model_type = 'clustering'
        
        if algorithm == 'kmeans':
            n_clusters = data.get('n_clusters', 3)
            model = KMeans(n_clusters=n_clusters)
            model.fit(X)
            predictions = model.predict(X)
            
            # Generate KMeans visualization
            fig, ax = plt.subplots(figsize=(10, 6))
            if X.shape[1] >= 2:
                scatter = ax.scatter(X.iloc[:, 0], X.iloc[:, 1], c=predictions, cmap='viridis', alpha=0.6, s=100, edgecolors='black', linewidth=0.5)
                ax.scatter(model.cluster_centers_[:, 0], model.cluster_centers_[:, 1], c='red', s=300, marker='X', edgecolors='black', linewidth=2, label='Centroids')
                ax.set_xlabel(feature_columns[0], fontsize=12)
                ax.set_ylabel(feature_columns[1], fontsize=12)
            else:
                scatter = ax.scatter(range(len(X)), X.iloc[:, 0], c=predictions, cmap='viridis', alpha=0.6, s=100, edgecolors='black', linewidth=0.5)
                ax.set_xlabel('Index', fontsize=12)
                ax.set_ylabel(feature_columns[0], fontsize=12)
            
            ax.set_title(f'KMeans Clustering (k={n_clusters})', fontsize=16, fontweight='bold')
            ax.legend()
            plt.colorbar(scatter, label='Cluster', ax=ax)
            plt.grid(True, alpha=0.3)
            
            buffer = io.BytesIO()
            plt.savefig(buffer, format='png', bbox_inches='tight', dpi=100)
            buffer.seek(0)
            visualization_img = f"data:image/png;base64,{base64.b64encode(buffer.read()).decode()}"
            plt.close()
            
            model_id = str(uuid.uuid4())
            trained_models[model_id] = {
                'model': model,
                'algorithm': algorithm,
                'model_type': model_type,
                'dataset_id': dataset_id,
                'feature_columns': feature_columns
            }
            
            return jsonify({
                'model_id': model_id,
                'algorithm': algorithm,
                'visualizations': [visualization_img],
                'metrics': {
                    'n_clusters': n_clusters,
                    'inertia': float(model.inertia_)
                }
            })
        
        # Train model based on algorithm
        if algorithm == 'linear_regression':
            model = LinearRegression()
        elif algorithm == 'polynomial_regression':
            model = Pipeline([
                ('poly', PolynomialFeatures(degree=2)),
                ('linear', LinearRegression())
            ])
        elif algorithm == 'ridge_regression':
            model = Ridge(alpha=1.0)
        elif algorithm == 'lasso_regression':
            model = Lasso(alpha=1.0)
        elif algorithm == 'logistic_regression':
            model = LogisticRegression(max_iter=1000)
        elif algorithm == 'naive_bayes':
            model = GaussianNB()
        elif algorithm == 'svm_regression':
            model = SVR()
        elif algorithm == 'svm_classification':
            model = SVC(probability=True)
        elif algorithm == 'knn_regression':
            model = KNeighborsRegressor()
        elif algorithm == 'knn_classification':
            model = KNeighborsClassifier()
        elif algorithm == 'decision_tree_classification':
            model = DecisionTreeClassifier(max_depth=5)
        elif algorithm == 'decision_tree_regression':
            model = DecisionTreeRegressor(max_depth=5)
        elif algorithm == 'random_forest_classification':
            model = RandomForestClassifier(n_estimators=100)
        elif algorithm == 'random_forest_regression':
            model = RandomForestRegressor(n_estimators=100)
        elif algorithm == 'neural_network_regression':
            model = MLPRegressor(hidden_layer_sizes=(100,), max_iter=500)
        elif algorithm == 'neural_network_classification':
            model = MLPClassifier(hidden_layer_sizes=(100,), max_iter=500)
        else:
            return jsonify({'error': 'Unknown algorithm'}), 400
        
        # Train supervised models
        model.fit(X_train, y_train)
        predictions = model.predict(X_test)
        
        # Calculate metrics
        metrics = {}
        if model_type == 'classification':
            metrics = {
                'accuracy': float(accuracy_score(y_test, predictions)),
                'precision': float(precision_score(y_test, predictions, average='weighted', zero_division=0)),
                'recall': float(recall_score(y_test, predictions, average='weighted', zero_division=0)),
                'f1_score': float(f1_score(y_test, predictions, average='weighted', zero_division=0))
            }
        else:  # regression
            metrics = {
                'mse': float(mean_squared_error(y_test, predictions)),
                'rmse': float(np.sqrt(mean_squared_error(y_test, predictions))),
                'mae': float(mean_absolute_error(y_test, predictions)),
                'r2_score': float(r2_score(y_test, predictions))
            }
        
        visualizations = generate_comprehensive_visualizations(
            model, model_type, algorithm, X_train, X_test, y_test, predictions, feature_columns
        )
        
        # Store model
        model_id = str(uuid.uuid4())
        trained_models[model_id] = {
            'model': model,
            'algorithm': algorithm,
            'model_type': model_type,
            'dataset_id': dataset_id,
            'X_test': X_test,
            'y_test': y_test,
            'predictions': predictions,
            'feature_columns': feature_columns
        }
        
        return jsonify({
            'model_id': model_id,
            'algorithm': algorithm,
            'metrics': metrics,
            'visualizations': visualizations
        })
        
    except Exception as e:
        print(f"Training error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

def generate_comprehensive_visualizations(model, model_type, algorithm, X_train, X_test, y_test, predictions, feature_columns):
    """Generate comprehensive visualizations including confusion matrix, ROC, distributions, decision tree, etc."""
    visualizations = []
    
    if 'decision_tree' in algorithm:
        try:
            fig, ax = plt.subplots(figsize=(20, 10))
            plot_tree(model, feature_names=feature_columns, filled=True, rounded=True, 
                     fontsize=10, ax=ax, class_names=True if model_type == 'classification' else False)
            ax.set_title(f'{algorithm.replace("_", " ").title()} - Tree Structure', 
                        fontsize=16, fontweight='bold')
            
            buffer = io.BytesIO()
            plt.savefig(buffer, format='png', bbox_inches='tight', dpi=100)
            buffer.seek(0)
            visualizations.append(f"data:image/png;base64,{base64.b64encode(buffer.read()).decode()}")
            plt.close()
        except Exception as e:
            print(f"Could not generate decision tree visualization: {e}")
    
    if model_type == 'classification':
        # Get probabilities if available
        y_proba = None
        if hasattr(model, 'predict_proba'):
            y_proba = model.predict_proba(X_test)
        elif hasattr(model, 'decision_function'):
            y_proba = model.decision_function(X_test)
        
        # 1. Confusion Matrix
        fig, ax = plt.subplots(figsize=(8, 6))
        cm = confusion_matrix(y_test, predictions)
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', cbar=True, square=True, ax=ax)
        ax.set_title(f'{algorithm.replace("_", " ").title()} - Confusion Matrix', fontsize=14, fontweight='bold')
        ax.set_ylabel('True Label', fontsize=12)
        ax.set_xlabel('Predicted Label', fontsize=12)
        
        buffer = io.BytesIO()
        plt.savefig(buffer, format='png', bbox_inches='tight', dpi=100)
        buffer.seek(0)
        visualizations.append(f"data:image/png;base64,{base64.b64encode(buffer.read()).decode()}")
        plt.close()
        
        # 2. ROC Curve (for binary classification)
        if y_proba is not None and len(np.unique(y_test)) == 2:
            try:
                fig, ax = plt.subplots(figsize=(8, 6))
                if y_proba.ndim > 1:
                    y_score = y_proba[:, 1]
                else:
                    y_score = y_proba
                
                fpr, tpr, _ = roc_curve(y_test, y_score)
                roc_auc = auc(fpr, tpr)
                
                ax.plot(fpr, tpr, color='blue', lw=2, label=f'ROC curve (AUC = {roc_auc:.4f})')
                ax.plot([0, 1], [0, 1], color='orange', lw=2, linestyle='--', label='Random Classifier')
                ax.set_xlim([0.0, 1.0])
                ax.set_ylim([0.0, 1.05])
                ax.set_xlabel('False Positive Rate (FPR)', fontsize=12)
                ax.set_ylabel('True Positive Rate (TPR)', fontsize=12)
                ax.set_title(f'{algorithm.replace("_", " ").title()} - ROC Curve', fontsize=14, fontweight='bold')
                ax.legend(loc="lower right")
                ax.grid(True, alpha=0.3)
                
                buffer = io.BytesIO()
                plt.savefig(buffer, format='png', bbox_inches='tight', dpi=100)
                buffer.seek(0)
                visualizations.append(f"data:image/png;base64,{base64.b64encode(buffer.read()).decode()}")
                plt.close()
            except Exception as e:
                print(f"Could not generate ROC curve: {e}")
        
        # 3. Probability Distribution (for binary classification)
        if y_proba is not None and len(np.unique(y_test)) == 2:
            try:
                fig, ax = plt.subplots(figsize=(8, 6))
                if y_proba.ndim > 1:
                    proba_class1 = y_proba[:, 1]
                else:
                    proba_class1 = y_proba
                
                # Separate probabilities by true class
                proba_class0_true = proba_class1[y_test == 0]
                proba_class1_true = proba_class1[y_test == 1]
                
                ax.hist(proba_class0_true, bins=30, alpha=0.7, label='Class 0 (True)', color='skyblue', edgecolor='black')
                ax.hist(proba_class1_true, bins=30, alpha=0.7, label='Class 1 (True)', color='orange', edgecolor='black')
                ax.set_xlabel('Predicted Probability for Class 1', fontsize=12)
                ax.set_ylabel('Frequency', fontsize=12)
                ax.set_title(f'{algorithm.replace("_", " ").title()} - Probability Distribution', fontsize=14, fontweight='bold')
                ax.legend()
                ax.grid(True, alpha=0.3)
                
                buffer = io.BytesIO()
                plt.savefig(buffer, format='png', bbox_inches='tight', dpi=100)
                buffer.seek(0)
                visualizations.append(f"data:image/png;base64,{base64.b64encode(buffer.read()).decode()}")
                plt.close()
            except Exception as e:
                print(f"Could not generate probability distribution: {e}")
        
        # 4. Prediction Distribution
        fig, ax = plt.subplots(figsize=(8, 6))
        unique, counts = np.unique(predictions, return_counts=True)
        ax.bar([str(u) for u in unique], counts, color='steelblue', edgecolor='black')
        ax.set_xlabel('Predicted Class', fontsize=12)
        ax.set_ylabel('Count', fontsize=12)
        ax.set_title(f'{algorithm.replace("_", " ").title()} - Prediction Distribution', fontsize=14, fontweight='bold')
        ax.grid(axis='y', alpha=0.3)
        
        buffer = io.BytesIO()
        plt.savefig(buffer, format='png', bbox_inches='tight', dpi=100)
        buffer.seek(0)
        visualizations.append(f"data:image/png;base64,{base64.b64encode(buffer.read()).decode()}")
        plt.close()
        
        # 5. Error Distribution (FP/FN)
        fig, ax = plt.subplots(figsize=(8, 6))
        fp = np.sum((predictions == 1) & (y_test == 0))
        fn = np.sum((predictions == 0) & (y_test == 1))
        
        ax.bar(['False Positives (FP)', 'False Negatives (FN)'], [fp, fn], 
               color=['orange', 'red'], edgecolor='black')
        ax.set_ylabel('Count', fontsize=12)
        ax.set_title(f'{algorithm.replace("_", " ").title()} - Error Distribution', fontsize=14, fontweight='bold')
        ax.grid(axis='y', alpha=0.3)
        
        buffer = io.BytesIO()
        plt.savefig(buffer, format='png', bbox_inches='tight', dpi=100)
        buffer.seek(0)
        visualizations.append(f"data:image/png;base64,{base64.b64encode(buffer.read()).decode()}")
        plt.close()
        
        # 6. Feature Importance (for tree-based models)
        if hasattr(model, 'feature_importances_'):
            try:
                fig, ax = plt.subplots(figsize=(8, 6))
                importances = model.feature_importances_
                indices = np.argsort(importances)[::-1][:min(8, len(feature_columns))]
                
                ax.barh([feature_columns[i] for i in indices], importances[indices], color='steelblue', edgecolor='black')
                ax.set_xlabel('Feature Importance (Impact on F1-score)', fontsize=12)
                ax.set_title(f'{algorithm.replace("_", " ").title()} - Top Feature Importance', fontsize=14, fontweight='bold')
                ax.invert_yaxis()
                ax.grid(axis='x', alpha=0.3)
                
                buffer = io.BytesIO()
                plt.savefig(buffer, format='png', bbox_inches='tight', dpi=100)
                buffer.seek(0)
                visualizations.append(f"data:image/png;base64,{base64.b64encode(buffer.read()).decode()}")
                plt.close()
            except Exception as e:
                print(f"Could not generate feature importance: {e}")
    
    elif model_type == 'regression':
        # 1. Actual vs Predicted
        fig, ax = plt.subplots(figsize=(8, 6))
        ax.scatter(y_test, predictions, alpha=0.6, s=100, edgecolors='black', linewidth=0.5)
        ax.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'r--', lw=3, label='Perfect Prediction')
        ax.set_xlabel('Actual Values', fontsize=12)
        ax.set_ylabel('Predicted Values', fontsize=12)
        ax.set_title(f'{algorithm.replace("_", " ").title()} - Actual vs Predicted', fontsize=14, fontweight='bold')
        ax.grid(True, alpha=0.3)
        ax.legend(fontsize=10)
        
        r2 = r2_score(y_test, predictions)
        ax.text(0.05, 0.95, f'R² = {r2:.4f}', transform=ax.transAxes,
                fontsize=12, verticalalignment='top',
                bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.5))
        
        buffer = io.BytesIO()
        plt.savefig(buffer, format='png', bbox_inches='tight', dpi=100)
        buffer.seek(0)
        visualizations.append(f"data:image/png;base64,{base64.b64encode(buffer.read()).decode()}")
        plt.close()
        
        # 2. Residual Plot
        fig, ax = plt.subplots(figsize=(8, 6))
        residuals = y_test - predictions
        ax.scatter(predictions, residuals, alpha=0.6, s=100, edgecolors='black', linewidth=0.5)
        ax.axhline(y=0, color='r', linestyle='--', lw=2)
        ax.set_xlabel('Predicted Values', fontsize=12)
        ax.set_ylabel('Residuals', fontsize=12)
        ax.set_title(f'{algorithm.replace("_", " ").title()} - Residual Plot', fontsize=14, fontweight='bold')
        ax.grid(True, alpha=0.3)
        
        buffer = io.BytesIO()
        plt.savefig(buffer, format='png', bbox_inches='tight', dpi=100)
        buffer.seek(0)
        visualizations.append(f"data:image/png;base64,{base64.b64encode(buffer.read()).decode()}")
        plt.close()
        
        # 3. Prediction Distribution
        fig, ax = plt.subplots(figsize=(8, 6))
        ax.hist(predictions, bins=30, alpha=0.7, color='steelblue', edgecolor='black')
        ax.set_xlabel('Predicted Values', fontsize=12)
        ax.set_ylabel('Frequency', fontsize=12)
        ax.set_title(f'{algorithm.replace("_", " ").title()} - Prediction Distribution', fontsize=14, fontweight='bold')
        ax.grid(axis='y', alpha=0.3)
        
        buffer = io.BytesIO()
        plt.savefig(buffer, format='png', bbox_inches='tight', dpi=100)
        buffer.seek(0)
        visualizations.append(f"data:image/png;base64,{base64.b64encode(buffer.read()).decode()}")
        plt.close()
        
        # 4. Feature Importance (for tree-based models)
        if hasattr(model, 'feature_importances_'):
            try:
                fig, ax = plt.subplots(figsize=(8, 6))
                importances = model.feature_importances_
                indices = np.argsort(importances)[::-1][:min(8, len(feature_columns))]
                
                ax.barh([feature_columns[i] for i in indices], importances[indices], color='steelblue', edgecolor='black')
                ax.set_xlabel('Feature Importance', fontsize=12)
                ax.set_title(f'{algorithm.replace("_", " ").title()} - Top Feature Importance', fontsize=14, fontweight='bold')
                ax.invert_yaxis()
                ax.grid(axis='x', alpha=0.3)
                
                buffer = io.BytesIO()
                plt.savefig(buffer, format='png', bbox_inches='tight', dpi=100)
                buffer.seek(0)
                visualizations.append(f"data:image/png;base64,{base64.b64encode(buffer.read()).decode()}")
                plt.close()
            except Exception as e:
                print(f"Could not generate feature importance: {e}")
    
    return visualizations

@app.route('/api/evaluate', methods=['POST'])
def evaluate_model():
    """Evaluate model and generate visualizations"""
    try:
        data = request.json
        model_id = data.get('model_id')
        dataset_id = data.get('dataset_id')
        
        if model_id not in trained_models:
            return jsonify({"error": "Model not found"}), 404
        
        if dataset_id not in datasets:
            return jsonify({"error": "Dataset not found"}), 404
        
        model_info = trained_models[model_id]
        model = model_info['model']
        df = datasets[dataset_id]
        
        X = df[model_info['feature_columns']]
        y = df[model_info['target_column']]
        
        predictions = model.predict(X)
        
        # Generate visualization
        plt.figure(figsize=(10, 6))
        
        if model_info['model_type'] == 'classification':
            # Confusion matrix
            cm = confusion_matrix(y, predictions)
            sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
            plt.title('Confusion Matrix')
            plt.ylabel('True Label')
            plt.xlabel('Predicted Label')
        
        elif model_info['model_type'] == 'regression':
            # Actual vs Predicted
            plt.scatter(y, predictions, alpha=0.5)
            plt.plot([y.min(), y.max()], [y.min(), y.max()], 'r--', lw=2)
            plt.xlabel('Actual Values')
            plt.ylabel('Predicted Values')
            plt.title('Actual vs Predicted')
        
        # Convert to base64
        buffer = io.BytesIO()
        plt.savefig(buffer, format='png', bbox_inches='tight')
        buffer.seek(0)
        image_base64 = base64.b64encode(buffer.read()).decode()
        plt.close()
        
        return jsonify({
            "metrics": model_info['metrics'],
            "visualization": f"data:image/png;base64,{image_base64}"
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/predict', methods=['POST'])
def predict():
    """Make predictions with trained model"""
    try:
        data = request.json
        model_id = data.get('model_id')
        input_data = data.get('input_data')
        
        if model_id not in trained_models:
            return jsonify({"error": "Model not found"}), 404
        
        model_info = trained_models[model_id]
        model = model_info['model']
        
        # Convert input to DataFrame
        X = pd.DataFrame([input_data])
        predictions = model.predict(X)
        
        return jsonify({
            "predictions": predictions.tolist()
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/export-results', methods=['POST'])
def export_results():
    """Export model results and metrics"""
    try:
        data = request.json
        model_id = data.get('model_id')
        
        if model_id not in trained_models:
            return jsonify({"error": "Model not found"}), 404
        
        model_info = trained_models[model_id]
        
        export_data = {
            "model_id": model_id,
            "algorithm": model_info['algorithm'],
            "model_type": model_info['model_type'],
            "feature_columns": model_info['feature_columns']
        }
        
        return jsonify(export_data)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("[v0] Starting Flask ML API server on port 5000...")
    app.run(host='0.0.0.0', port=5000, debug=True)
