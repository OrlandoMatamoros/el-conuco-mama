import pandas as pd
import json

# Leer el archivo Excel
file_path = '/mnt/user-data/uploads/Dashboard_1_1.xlsx'

# Cargar todas las hojas
xl_file = pd.ExcelFile(file_path)
print("📊 ANÁLISIS DEL DASHBOARD DE EXCEL\n")
print(f"Hojas encontradas: {xl_file.sheet_names}\n")

# Analizar cada hoja
for sheet_name in xl_file.sheet_names[:5]:  # Primeras 5 hojas
    print(f"━━━ HOJA: {sheet_name} ━━━")
    df = pd.read_excel(file_path, sheet_name=sheet_name)
    print(f"Dimensiones: {df.shape[0]} filas x {df.shape[1]} columnas")
    
    if not df.empty:
        print(f"Columnas: {list(df.columns)[:10]}")  # Primeras 10 columnas
        
        # Si es la hoja Dashboard, analizar estructura
        if sheet_name == "Dashboard":
            print("\n📈 Estructura del Dashboard:")
            # Ver primeras filas para entender KPIs
            for i in range(min(20, len(df))):
                row_data = df.iloc[i].dropna().head(5)
                if not row_data.empty:
                    print(f"Fila {i+1}: {row_data.to_dict()}")
        
        # Si es la hoja DAX, ver las métricas
        elif "DAX" in sheet_name.upper() or "METRIC" in sheet_name.upper():
            print("\n📐 Métricas DAX encontradas:")
            print(df.head(10).to_string())
    
    print("\n")

# Identificar tablas de datos
print("📊 TABLAS DE DATOS IDENTIFICADAS:")
for sheet_name in xl_file.sheet_names:
    df = pd.read_excel(file_path, sheet_name=sheet_name)
    if len(df) > 10 and len(df.columns) > 2:  # Probablemente una tabla de datos
        print(f"- {sheet_name}: {len(df)} registros")
        if 'Fecha' in str(df.columns) or 'fecha' in str(df.columns).lower():
            print(f"  → Contiene fechas (datos temporales)")
        if 'Venta' in str(df.columns) or 'venta' in str(df.columns).lower():
            print(f"  → Contiene ventas")

