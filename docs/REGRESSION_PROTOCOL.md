# Protocolo anti-regresion LibreAprendiz Split

Este protocolo es obligatorio cuando se toca una funcion sensible o un bug ya corregido.

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

- `BASE_URL`: URL a probar. Default: `http://127.0.0.1:8765/split/`.
- `FAC_ID`: default `FAC-001`.
- `FAC_PIN`: default `4101`.
- `HEADFUL=1`: abre navegador visible.
- `STRICT_NEW_SESSION_UI=1`: ademas de verificar persistencia por API, abre el detalle en una segunda sesion y valida la UI. Es mas lento, hace mas logins y puede fallar por rate-limit/latencia visual, por eso no es default.

La verificacion de persistencia reintenta hasta 90s porque el outbox puede seguir sincronizando en segundo plano. Usa `skip_cache` para no confundir cache viejo de observaciones con fallo de guardado.

El runner reporta reintentos de outbox solo en consola/JSON tecnico:

- `outboxRetryCount`
- `outboxRetryReasons`

Esto no debe convertirse en mensaje visible para el facilitador. La UI debe mantenerse simple: guardado instantaneo, y solo mostrar problema si queda pendiente/fallido.
