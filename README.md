# Machine Learning Platform

A comprehensive full-stack machine learning application with Python Flask backend and React Next.js frontend.

## Features

### ✅ Complete Implementation of All Requirements

1. **Interface Utilisateur Intuitive** - User-friendly interface with drag-and-drop CSV upload
2. **Représentation des Données** - Interactive data visualizations (correlation matrices, distributions, scatter plots)
3. **Gestion des Données** - Complete data preprocessing:
   - Handle missing values (mean, median, mode, drop, forward/backward fill)
   - Normalize/standardize features
   - Encode categorical variables
4. **Algorithmes de Machine Learning** - 10+ algorithms implemented:
   - Regression: Linear, Polynomial, Ridge, Lasso, SVR
   - Classification: Logistic Regression, Decision Trees, Naive Bayes, SVM, KNN
   - Ensemble: Random Forest
   - Clustering: K-Means
   - Neural Networks: MLP Classifier/Regressor
5. **Validation des Modèles** - Comprehensive evaluation metrics:
   - Classification: Accuracy, Precision, Recall, F1-Score
   - Regression: R², MSE, RMSE, MAE
   - Clustering: Silhouette Score
6. **Visualisation des Résultats** - Algorithm-specific visualizations:
   - Decision Trees: Tree structure diagram
   - Random Forest: Feature importance chart
   - Classification: Confusion matrices
   - Regression: Actual vs Predicted plots
   - K-Means: Cluster scatter plots
7. **Exportation des Résultats** - Export trained models and results
8. **Documentation et Tutoriels** - Complete documentation and setup guide

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 18+

### 1. Install Python Dependencies

```bash
pip install flask flask-cors pandas numpy scikit-learn matplotlib seaborn
```

### 2. Start the Python Backend

```bash
python scripts/api_backend.py
```

The Flask API will start on `http://localhost:5000`

### 3. Start the React Frontend

In a separate terminal:

```bash
npm install
npm run dev
```

The Next.js app will start on `http://localhost:3000`

## Usage Workflow

1. **Upload Dataset** - Upload a CSV file with your data
2. **Preprocess Data** (Optional but Recommended):
   - Handle missing values
   - Normalize numeric features
   - Encode categorical variables
3. **Visualize Data** - Explore your data with interactive charts
4. **Train Model** - Select an algorithm and target column
5. **View Results** - Analyze metrics and visualizations
6. **Export** - Download trained model and results

## Available Algorithms

### Regression
- Linear Regression
- Polynomial Regression
- Ridge Regression
- Lasso Regression
- Support Vector Regression (SVR)
- K-Nearest Neighbors Regression
- Neural Network Regression

### Classification
- Logistic Regression
- Decision Tree Classifier
- Naive Bayes
- Support Vector Machine (SVM)
- Random Forest Classifier
- K-Nearest Neighbors Classifier
- Neural Network Classifier

### Clustering
- K-Means

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/upload-dataset` - Upload CSV dataset
- `POST /api/preprocess` - Preprocess data (handle missing values, normalize, encode)
- `POST /api/visualize` - Generate data visualizations
- `POST /api/train` - Train ML model with algorithm-specific visualizations
- `POST /api/evaluate` - Evaluate trained model
- `POST /api/predict` - Make predictions with trained model
- `POST /api/export-results` - Export model results

## Technologies Used

### Backend
- Flask - Web framework
- scikit-learn - Machine learning algorithms
- pandas - Data manipulation
- matplotlib/seaborn - Visualizations

### Frontend
- Next.js 16 - React framework
- TypeScript - Type safety
- Tailwind CSS v4 - Styling
- shadcn/ui - UI components

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes (proxies to Python backend)
│   └── page.tsx           # Main application page
├── components/            # React components
│   ├── data-upload.tsx           # CSV upload interface
│   ├── data-preprocessing.tsx    # Data cleaning UI
│   ├── data-visualization.tsx    # Charts and graphs
│   ├── model-training.tsx        # Model training interface
│   └── results-view.tsx          # Results and metrics display
├── scripts/
│   └── api_backend.py     # Flask backend with ML algorithms
└── README.md              # This file
```

## Requirements Checklist

- ✅ Interface Utilisateur Intuitive
- ✅ Représentation des Données
- ✅ Gestion des Données (Preprocessing)
- ✅ Algorithmes de Machine Learning (10+ algorithms)
- ✅ Validation des Modèles (Comprehensive metrics)
- ✅ Visualisation des Résultats (Algorithm-specific)
- ✅ Exportation des Résultats
- ✅ Documentation et Tutoriels

All requirements have been fully implemented!
