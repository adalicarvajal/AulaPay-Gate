\# Matriz de hallazgos - AulaPay



| Prioridad | Fuente | Evidencia | Impacto | Criticidad | Decisión |

|---|---|---|---|---|---|

| 1 | API Security Test / Burp Suite | Usuario 1024 solicita /api/payments/2048 y obtiene 200 OK | Exposición de comprobantes de otro estudiante | CRÍTICA | Bloquear despliegue y corregir autorización |

| 2 | SAST / Semgrep | studentId concatenado directamente en consulta SQL | Posible SQL Injection y acceso indebido a información | ALTA | Bloquear y utilizar consulta parametrizada |

| 3 | Secret Scan / Gitleaks | sk\_test\_51HxxExampleToken en .env.example | Posible exposición de credencial | ALTA inicialmente | Validar el token. Se determina que es ficticio y se reemplaza por placeholder |

| 4 | SCA | pdf-generator-lib 2.4.1 / CVE-SIM-2025-1842 | Riesgo durante generación de comprobantes | MEDIA | Actualizar a versión 2.4.3 |



\## Priorización



\### CRÍTICO



La falla de autorización a nivel de objeto tiene la mayor prioridad debido a que un estudiante autenticado puede consultar comprobantes pertenecientes a otro estudiante.



\### ALTO



La concatenación directa del parámetro studentId dentro de la consulta SQL representa un riesgo de SQL Injection.



El supuesto secreto detectado inicialmente se clasifica como alto hasta determinar si corresponde a una credencial real.



\### MEDIO



La dependencia pdf-generator-lib 2.4.1 presenta una vulnerabilidad simulada de severidad media. Debido a que existe la versión corregida 2.4.3, se decide actualizar.



\## Falso positivo justificado



El valor sk\_test\_51HxxExampleToken fue localizado en .env.example y contiene claramente la palabra ExampleToken.



Al tratarse de un valor creado para documentación y no una credencial funcional, se clasifica como falso positivo después de la validación.



A pesar de ello, se reemplazó por:



PAYMENT\_API\_KEY=REPLACE\_WITH\_TEST\_KEY



Si el token hubiese resultado real, se debería revocar o rotar inmediatamente y revisar el historial Git.

