\# Decisión del Gate DevSecOps



\## Estado inicial



\*\*GATE RECHAZADO\*\*



El despliegue no puede avanzar debido a dos condiciones principales:



1\. El usuario autenticado studentId=1024 puede acceder al recurso de studentId=2048 obteniendo HTTP 200 OK.

2\. El código concatena directamente studentId dentro de una consulta SQL.



También se encontraron:



\- Un supuesto token en .env.example que requiere validación.

\- Una dependencia simulada pdf-generator-lib 2.4.1 con vulnerabilidad de severidad MEDIA.



\## Evidencias de la matriz

![Entregable 1 - Matriz de hallazgos](../evidencias/entregable-1-matriz-hallazgos.png)

![Entregable 2 - Clasificacion priorizada](../evidencias/entregable-2-clasificacion-priorizada.png)

## Evidencias de los productos 3 a 7

### Producto 3 - Correccion del codigo vulnerable

![Producto 3 - Correccion del codigo vulnerable](../evidencias/producto-3.png)

### Producto 4 - Decision sobre el supuesto secreto

![Producto 4 - Decision sobre el supuesto secreto](../evidencias/producto-4.png)

### Producto 5 - Decision sobre la dependencia vulnerable

![Producto 5 - Decision sobre la dependencia vulnerable](../evidencias/producto-5.png)

### Producto 6 - Condicion de aprobacion del gate

![Producto 6 - Condicion de aprobacion del gate](../evidencias/producto-6.png)

### Producto 7 - Evidencia API antes y despues

![Producto 7 - Evidencia API antes y despues](../evidencias/producto-7.png)

\## Correcciones aplicadas



\### SQL Injection



Antes:



```javascript

const query =

&#x20; "SELECT id, student\_id, amount, payment\_date, receipt\_url " +

&#x20; "FROM payments WHERE student\_id = " + studentId;

