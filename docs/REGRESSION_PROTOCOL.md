# Protocolo anti-regresion LibreAprendiz Split

Este protocolo es obligatorio cuando se toca una funcion sensible o un bug ya corregido.

## Roles operativos

### Hunter - auditor anti-regresion

Hunter es el auditor read-only. Su trabajo es buscar regresiones probables antes de staging o produccion.

Responsabilidades:

- Leer el diff actual y las funciones tocadas.
- Leer callsites directos e indirectos antes de opinar.
- Identificar si la zona ya tuvo regresiones historicas.
- Revisar rutas de login, sesion, cache, snapshot, outbox y UI movil cuando apliquen.
- Confirmar que no se esta repitiendo un parche ya existente.
- Definir las pruebas minimas obligatorias para el cambio.
- Priorizar hallazgos P0/P1/P2 y evitar ruido de mejoras no relacionadas.

Restricciones:

- No modifica codigo.
- No publica staging ni produccion.
- No corre scripts destructivos.
- No convierte una auditoria en refactor.
- Si necesita validar con navegador, debe ser read-only salvo que el usuario autorice a Bartolo.

Salida esperada:

- Veredicto: aprobado, aprobado con P2, o bloqueado.
- Riesgos concretos por actor: facilitador, admin, familia, alumno.
- Pruebas obligatorias antes de publicar.
- Archivos y funciones que requieren atencion.

### Bartolo - runner QA de staging

Bartolo es el runner de pruebas reales en staging. Su trabajo es comportarse como usuario real y comprobar que los flujos siguen funcionando despues de un parche.

Responsabilidades:

- Probar solamente staging, salvo autorizacion explicita del usuario.
- Ejecutar flujos reales de facilitador/admin segun el parche.
- Para planeaciones, cubrir grupo normal, multigrupo y taller cuando aplique.
- Validar crear, editar, guardar, activar, cerrar, observaciones generales y observaciones por alumno cuando el cambio toque planeaciones.
- Validar persistencia real contra backend cuando el flujo escribe datos.
- Ejecutar pruebas de escritura en serie, nunca en paralelo.
- Usar datos QA con prefijo unico por corrida.
- Borrar solo los datos creados por la misma corrida y solo por IDs exactos, si existe limpieza segura.
- Reportar tiempos, errores visuales, errores de consola y evidencia del resultado.

Restricciones:

- Produccion prohibida para escrituras, limpiezas o scripts de mantenimiento.
- No usa scripts destructivos generales.
- No borra datos por filtros amplios.
- No modifica codigo.
- Si una prueba falla, se detiene y reporta; no intenta parchear.

Salida esperada:

- Ambiente probado.
- Usuario QA usado.
- Escenarios ejecutados, uno por uno.
- Datos creados y limpiados, con IDs.
- Resultado final verde/rojo.
- Bloqueadores para produccion si los hay.

Regla de coordinacion:

- Hunter decide que pruebas hacen falta.
- Bartolo ejecuta las pruebas autorizadas en staging.
- Un solo implementador aplica parches.
- Ninguno de los dos reemplaza al implementador.

## Regla obligatoria antes de produccion

Cuando un cambio toque funciones sensibles, datos reales, login, sesion, cache, snapshot, outbox, planeaciones, admin ops, scripts de mantenimiento o cualquier flujo que afecte a facilitadores/familias/alumnos, la secuencia obligatoria es:

1. Hunter antes de publicar:
   - revisa diff, callsites y riesgos;
   - define pruebas minimas obligatorias;
   - bloquea si encuentra P0/P1 sin resolver.
2. Staging primero:
   - ningun cambio sensible salta directo a produccion;
   - si hay escritura, se hace solo en staging.
3. Bartolo en staging cuando el flujo sea operativo:
   - ejecuta pruebas reales en serie;
   - escribe solo datos QA controlados;
   - valida persistencia real;
   - limpia solo lo que creo, si existe limpieza segura.
4. Produccion solo si staging queda verde:
   - el usuario debe autorizar el pase a produccion cuando aplique;
   - no se ejecutan scripts destructivos.
5. Post-produccion:
   - solo smoke read-only;
   - login real autorizado;
   - validar que datos cargan;
   - validar session/cache boundary si aplica;
   - prohibido crear, borrar o limpiar datos sin autorizacion explicita.

Excepciones:

- Cambios pequenos de texto, copy o CSS aislado pueden usar Hunter ligero y smoke visual.
- Si el cambio toca login, sesion, planeaciones, cache, outbox o mantenimiento, no hay excepcion: Hunter + staging + Bartolo antes de produccion.

Comando oficial de pre-produccion facilitador:

```powershell
npm run qa:facilitador:preprod
```

Este gate:

- bloquea backend/frontend de produccion;
- corre `test:facilitador:session-boundary`;
- limpia datos QA de staging con `reset:testdata` antes de las pruebas que escriben;
- corre `qa:planeaciones:staging-serial` en serie.

Opcional cuando el parche toca `savePlanChanges`, outbox, observaciones, multigrupo o taller:

```powershell
npm run qa:facilitador:preprod -- --include-bartolo
```

Para revisar el plan sin escribir datos:

```powershell
npm run qa:facilitador:preprod -- --dry-run
```

Para revisar tambien el plan de Bartolo sin escribir datos:

```powershell
npm run qa:facilitador:preprod -- --include-bartolo --dry-run
```

Atajo equivalente:

```powershell
npm run qa:facilitador:preprod -- --bartolo-dry-run --dry-run
```

Artifact del gate:

- Cada corrida genera un JSON en `artifacts/preprod-gate/<runId>.json`.
- El artifact incluye ambiente, comandos planeados, comandos ejecutados, duracion, exit code y resultado.
- Si se incluye Bartolo, su artifact queda bajo `artifacts/preprod-gate/bartolo/<runId>-BARTOLO.json`.
- Variables utiles:
  - `PREPROD_GATE_RUN_ID`: fija el identificador de corrida.
  - `PREPROD_GATE_ARTIFACT_DIR`: cambia la carpeta de salida.

Regla para Hunter:

- Antes de aprobar produccion, revisar el artifact mas reciente del gate y confirmar `status: "passed"`.
- Si el gate fallo, usar `results` para ubicar el primer comando fallido antes de pedir nuevo parche.

Regla para Bartolo:

- Cuando corre dentro del gate, Bartolo debe usar el `runId` heredado para que sus escrituras queden ligadas al artifact principal.
- El artifact de Bartolo nunca reemplaza el artifact del gate; ambos deben existir cuando se use `--include-bartolo`.

## Funciones sensibles

- `savePlanChanges`
- `renderPlaneacionesList`
- boot/login
- outbox/snapshot
- activar planeacion
- marcar material listo
- cierre de semana
- guardados admin
- flujos multigrupo/taller

## Antes de tocar codigo

1. Identificar si la zona ya tuvo regresiones.
2. Listar callsites directos e indirectos.
3. Separar estados:
   - fuente visual inmediata
   - fuente backend
   - draft/input visible
   - cache/snapshot
   - outbox
   - rollback/error
4. Confirmar que una condicion visual no esta siendo usada como condicion de guardado.
   - Mal: "existe editor multigrupo, entonces guarda lote".
   - Bien: "la firma compartida cambio, entonces guarda lote".
5. Definir la prueba anti-regresion especifica antes del parche.

## Durante el parche

- Un parche = un problema.
- No mezclar frontend/backend/diseno salvo necesidad explicita.
- No crear un segundo estado visual para el mismo dato sin definir cual reemplaza al anterior.
- Si un dato se muestra como guardado, el input/draft que lo capturo debe limpiarse en exito local.
- El outbox puede conservar payload para reintento, pero no debe reinyectarlo como texto visible.

## Regla obligatoria: login, restore, snapshot y session boundary

Esta regla es obligatoria antes de tocar cualquiera de estas zonas:

- `login`
- `logout`
- `loadSession`
- `saveSession`
- `clearSessionScopedState`
- `handleInvalidSessionBoundary`
- `refreshAll`
- `refreshFacilitadorPlaneacionesFastBoot`
- `restoreBootSnapshot*`
- `scheduleDeferredRestoreRefresh`
- `ensurePlaneacionesCatalogosAvailable`
- outbox/sync de planeaciones
- cualquier `catch` en una llamada autenticada al backend

### Regla principal

`INVALID_SESSION` nunca es un error secundario.

Ningun `catch (_) {}` o `catch (err) {}` dentro de un flujo autenticado puede tragar `INVALID_SESSION`.

Debe hacer una de estas dos cosas:

1. llamar a `handleInvalidSessionBoundary(err, tokenEsperado)`, o
2. relanzar el error para que lo capture `handleAction` / `refreshAll`.

Si una carga en background falla por `INVALID_SESSION`, la app debe terminar en estado de login:

- `state.session === null`;
- `localStorage.la_v8_session` eliminado;
- `body.auth-mode` activo;
- boton `Cerrar sesion` oculto;
- formulario de login visible;
- banner claro: "Tu sesion expiro o ya no es valida. Vuelve a iniciar sesion.";
- ninguna lista/editor debe quedar simulando una sesion activa.

### Error que no debe repetirse

No tratar el boot rapido con snapshot como si fuera solo UI local. Si restaura una pantalla desde cache y despues hidrata catalogos/planeaciones en Fase B, todas esas llamadas diferidas siguen siendo llamadas autenticadas. Si el token ya no es valido, deben cerrar la sesion.

La regresion de mayo 2026 ocurrio porque `refreshFacilitadorPlaneacionesFastBoot` restauraba snapshot local y varias cargas diferidas tenian `catch (_) {}`. Esos catches ocultaban `INVALID_SESSION`, dejando al facilitador viendo usuario/logout con catalogos vacios.

### Prueba minima antes de staging

Simular navegador con cache vieja:

1. Inyectar `localStorage.la_v8_session` con token falso.
2. Inyectar `localStorage.la_v8_boot_snapshot` compatible con `APP_CLIENT_VERSION`, usuario facilitador y `planeacionesMeta.loaded = true`.
3. Abrir la app en viewport movil.
4. Esperar a que corran las cargas diferidas.
5. Verificar que termina en login y no en shell de facilitador.

La prueba debe fallar si ocurre cualquiera de estos sintomas:

- aparece el banner de sesion expirada pero sigue visible `Cerrar sesion`;
- sigue visible el nombre del facilitador;
- el editor muestra "No hay grupos disponibles" por falta de catalogos despues de un token invalido;
- queda `localStorage.la_v8_session`;
- la lista muestra estado vacio como si la sesion fuera valida.

Comando automatizado:

```powershell
npm run test:facilitador:session-boundary
```

Regla para Hunter:

- Si el diff toca `login`, `logout`, `loadSession`, `saveSession`, snapshots, outbox, `refreshFacilitadorPlaneacionesFastBoot`, `ensurePlaneacionesCatalogosAvailable` o cualquier `catch` autenticado, Hunter debe exigir este comando antes de aprobar staging.

Regla para Bartolo:

- Bartolo debe correr este comando antes o despues de sus pruebas de flujo cuando el parche toque sesion/cache/planeaciones.
- Si el comando falla, Bartolo se detiene y no ejecuta pruebas de escritura.

### Prueba minima antes de produccion

Despues de pasar staging:

1. Repetir la simulacion de sesion/snapshot invalido contra produccion, sin credenciales reales y sin escribir datos.
2. Hacer login real read-only con un facilitador de prueba autorizado.
3. Abrir el editor de planeacion.
4. Confirmar que materias y grupos se hidratan.
5. No correr pruebas de escritura en produccion salvo autorizacion explicita.

Si cualquiera de esos pasos falla, no se publica el cambio.

## Despues del parche

Ejecutar la prueba especifica del bug, no solo smoke general.

Para `savePlanChanges`, minimo:

- Grupo normal: guardar observacion general.
- Multigrupo normal: guardar observacion general.
- Taller multigrupo: guardar observacion general.
- Multigrupo normal: guardar observacion final por alumno.
- Taller multigrupo: guardar observacion final por alumno.
- Verificar:
  - boton vuelve rapido;
  - tarjeta no desaparece;
  - observacion aparece una sola vez;
  - textarea de observacion general queda vacio;
  - observacion final queda visible en el campo del alumno;
  - API backend confirma con `skip_cache` que la observacion persistio;
  - no se llama guardado pesado de lote si solo cambio observacion.

## Comando recomendado

Desde `C:\Users\rafae\OneDrive\Documents\libretest`:

```powershell
$env:NODE_PATH='C:\Users\rafae\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules'
& 'C:\Users\rafae\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' scripts\regression-save-planchanges.js
```

Variables utiles:

- `BASE_URL`: URL a probar. Default: `http://127.0.0.1:8765/split/`. Solo se permite localhost o staging (`https://cdkeyhouse.github.io/libretest/split/`). Produccion queda bloqueada.
- `FAC_ID`: default `FAC-001`.
- `FAC_PIN`: default `4101`.
- `HEADFUL=1`: abre navegador visible.
- `STRICT_NEW_SESSION_UI=1`: ademas de verificar persistencia por API, abre el detalle en una segunda sesion y valida la UI. Es mas lento, hace mas logins y puede fallar por rate-limit/latencia visual, por eso no es default.
- `DRY_RUN=1` o `--dry-run`: imprime escenarios, ambiente y artifact sin abrir navegador ni escribir datos.
- `BARTOLO_RUN_ID`: identificador explicito de corrida. Si no se define, Bartolo genera uno.
- `ARTIFACT_DIR`: carpeta de salida para JSON. Default: `artifacts/bartolo`.
- `SCENARIO_FILTER`: limita la corrida a escenarios cuyo nombre contenga el filtro.
- `REQUIRE_SCENARIO_FILTER=1` o `--require-scenario-filter`: bloquea la corrida si no hay `SCENARIO_FILTER`; util para parches puntuales.

Contrato de escritura segura:

- Cada nota escrita por Bartolo incluye el `runId`.
- Cada corrida genera un artifact JSON con ambiente, escenarios, resultados y escrituras.
- Si falla a media corrida, el artifact incluye `pendingWrites` para saber que quedo sin confirmar.
- Bartolo no limpia datos por filtros amplios. Cualquier limpieza futura debe usar IDs exactos listados en el artifact.

La verificacion de persistencia reintenta hasta 90s porque el outbox puede seguir sincronizando en segundo plano. Usa `skip_cache` para no confundir cache viejo de observaciones con fallo de guardado.

El runner reporta reintentos de outbox solo en consola/JSON tecnico:

- `outboxRetryCount`
- `outboxRetryReasons`

Esto no debe convertirse en mensaje visible para el facilitador. La UI debe mantenerse simple: guardado instantaneo, y solo mostrar problema si queda pendiente/fallido.
