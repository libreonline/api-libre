    const STORAGE_KEYS = {
      session: 'la_v8_session',
      bootSnapshot: 'la_v8_boot_snapshot',
      planeacionOutbox: 'la_v8_planeacion_outbox'
    };
    const BOOT_SNAPSHOT_MAX_AGE_MS = 1000 * 60 * 60 * 12;
    const FACILITADOR_FEED_SNAPSHOT_MAX_AGE_MS = 1000 * 60 * 3;
    const OPEN_PLAN_DETAIL_SNAPSHOT_MAX_AGE_MS = 1000 * 60 * 8;
    const OPEN_PLAN_OBS_SNAPSHOT_MAX_AGE_MS = 1000 * 60 * 8;
    const OPEN_PLAN_DETAIL_PREFETCH_LIMIT = 10;
    const OPEN_PLAN_DETAIL_PREFETCH_CONCURRENCY = 2;
    const OPEN_PLAN_DETAIL_PREFETCH_DELAY_MS = 650;
    const ADMIN_PLAN_DETAIL_WARMUP_LIMIT = 4;
    const ADMIN_PLAN_DETAIL_WARMUP_CONCURRENCY = 2;
    const ADMIN_PLAN_DETAIL_WARMUP_DELAY_MS = 120;
    // V2: cap conservador para snapshot. No persistir más de N detalles
    // prefetched (excluyendo openPlan que va aparte) para no inflar
    // localStorage. 5 cubre la mayoría de los casos del facilitador.
    const PREFETCHED_DETAIL_SNAPSHOT_LIMIT = 5;
    const LOGIN_PRELOAD_CATALOG_BLOCKS = ['materias', 'semanas', 'grupos'];

    function createEmptyAlumnoEditorState() {
      return {
        alumno_id: '',
        matricula: '',
        nombres: '',
        alias: '',
        aliasTouched: false,
        apellidos: '',
        grupo_id: '',
        estatus: 'activo',
        notas_internas: ''
      };
    }

    function createEmptyAlumnoCambioState() {
      return {
        alumno_id: '',
        nuevo_grupo_id: '',
        motivo: ''
      };
    }

    function createEmptyAlumnoDeleteState() {
      return {
        expanded: false,
        idsText: '',
        trashReportFiles: true,
        preview: null,
        previewIds: [],
        lastResult: null,
        confirmationText: ''
      };
    }

    function createEmptyAlumnosUiState() {
      return {
        search: '',
        filter: 'activos',
        grupo: '',
        sourceRevision: 0,
        editorOpen: false,
        editorMode: 'new',
        selectedAlumnoId: '',
        editor: createEmptyAlumnoEditorState(),
        cambioGrupoOpen: false,
        cambioGrupo: createEmptyAlumnoCambioState(),
        historialOpen: false,
        historialAlumnoId: '',
        archivedShadow: {},
        remoteHistoryByAlumno: {},
        remoteHistoryLoadedByAlumno: {},
        remoteHistoryFailedByAlumno: {},
        historyByAlumno: {},
        notesByAlumno: {},
        deleteControl: createEmptyAlumnoDeleteState(),
        mockRows: []
      };
    }

    function createEmptyFacilitadorEditorState() {
      return {
        facilitador_id: '',
        nombre_completo: '',
        nombre_mostrado: '',
        rol: 'facilitador',
        color_ui: '',
        activo: true,
        pin_plano: ''
      };
    }

    function createEmptyFacilitadorAsignacionState() {
      return {
        asignacion_id: '',
        facilitador_id: '',
        grupo_id: '',
        materia_id: '',
        taller_id: '',
        tipo: 'grupo',
        activa: true,
        fecha_inicio: '',
        fecha_fin: ''
      };
    }

    function createEmptyFacilitadoresUiState() {
      return {
        search: '',
        filter: 'activos',
        selectedFacilitadorId: '',
        panelMode: 'detail',
        editorOpen: false,
        editorMode: 'new',
        editor: createEmptyFacilitadorEditorState(),
        pinOpen: false,
        pinValue: '',
        asignacionOpen: false,
        asignacion: createEmptyFacilitadorAsignacionState(),
        pulsePlaneacionesFacilitadorId: '',
        pulsePlaneaciones: [],
        pulsePlaneacionesLoading: false,
        pulsePlaneacionesError: ''
      };
    }

    function createEmptyTallerEditorState() {
      return {
        taller_id: '',
        nombre: '',
        materia_id: '',
        facilitador_id: '',
        estatus: 'activo'
      };
    }

    function createEmptyTalleresUiState() {
      return {
        search: '',
        filter: 'activos',
        selectedTallerId: '',
        editorOpen: false,
        editorMode: 'new',
        editor: createEmptyTallerEditorState(),
        membershipOpen: false,
        membershipSearch: '',
        membershipGroup: '',
        membershipSelectedAlumnoIds: []
      };
    }

    function createEmptyMateriaEditorState() {
      return {
        materia_id: '',
        nombre: '',
        admite_submaterias: false,
        estatus: 'activa'
      };
    }

    function createEmptySubmateriaEditorState() {
      return {
        submateria_id: '',
        materia_id: '',
        nombre: '',
        estatus: 'activa'
      };
    }

    function createEmptyMateriasUiState() {
      return {
        search: '',
        filter: 'activas',
        selectedMateriaId: '',
        editorOpen: false,
        editorMode: 'new',
        editor: createEmptyMateriaEditorState(),
        subEditorOpen: false,
        subEditorMode: 'new',
        subEditor: createEmptySubmateriaEditorState()
      };
    }

    function createEmptyReportesUiState() {
      return {
        alumno_id: '',
        periodo_id: '',
        lastResult: null
      };
    }

    function createEmptyMaintenanceUiState() {
      return {
        selectedCategories: ['planeaciones', 'seguimiento', 'evaluaciones', 'reportes'],
        trashReportFiles: true,
        preview: null,
        previewSignature: '',
        audit: null,
        lastReset: null
      };
    }

    const STAGING_BACKEND_URL = 'https://script.google.com/macros/s/AKfycbw_uv4htKdG-Qur5DZysZgdbOdQ8kCeGJiIkErJut3-U7QQqGq8TV3HwggGaJfGIqgqyw/exec';
    const PRODUCTION_BACKEND_URL = 'https://script.google.com/macros/s/AKfycbwoUFz4MwbWimGIHgQZtykkdHOSRA694gA8QDGzEkqIX4dX93H8Mvst8LuaVOnaznNj/exec';
    const FIXED_BACKEND_URL = (
      typeof window !== 'undefined' &&
      window.location &&
      String(window.location.hostname || '').toLowerCase() === 'libreonline.github.io'
    ) ? PRODUCTION_BACKEND_URL : STAGING_BACKEND_URL;
    const BRAND_LOGO = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAN4AAAECCAYAAACR7GlXAAAACXBIWXMAAAsSAAALEgHS3X78AAAgAElEQVR4nO2dC3xcVbX/1z7nzGQySUlDA6HySGnLQ9AScnnk3hhJwZQWEh6KIvpXC3rv569ShYCA/BEB/ShXIa0W0Kvy8l7xcUWKibQQHsVQDIJpCr28bkib0tKmpE0fyWQe5/H/rGRPOTn7zMyZmTPnMbO/n08/bfc5mTlncn6z1l577bWIpmnA4XCcReKft3fp6m+eDQAtIanmIlmNfpyAOCeh7p9tdsECKYuKJLRPFALvRuXRRwBgfXtD7wBzIscTcIvnMbr6m+eVB47qSCgHPi+rkcMJiKCBkvVFCkTSNE1Ty6Tq/qg8+oP2ht41zEkc1+DC8whd/c0tZeLhv4gpe0+w+4p0Ivx1VB69o72hdytzEsdRuPBcpqu/uT4gzHpcVseP08CZ30VIqnkwKo92tDf07mMOZom6oa4eAGbTP/VpfhrdXny/rULTcMkLnwvPJXD+FpKOeCQm71mqgUqcvgoCohIUq25cctrjdzMHU0BF1kIFhn9OMz/TEs+jCHEuin9KTYxceC6AVk4gZRtULRZ28zpw/hgQZ22OK/uaU1k/dUPdJQCQ/FPFnGAfw1SEa4Sm4aKfj3LhOcxTmy6+LqbsvctL1ySQsoiqxZqSUVBq2a5xQGyp2A8ADwHAqmK1hFx4DrJuoO12WT34HTdcy0wQENXT1V23z41NngsA52Q43UnQJb1NaBpe76FryhsuPId4YuOS+1UtdqUXRZdEABE+lhiGWbLKHPMARSVALjwHQPcyruz7sZdFl8Tj4gMqwOV+d0EFZoRjK34SHaKCAn3B40H27tWiG7xF3VB3G3PER3CLV0AweklA/IcGiu++4GqFAJwx8Q4z7jE2Uevnu9Q4bvEKiCSEn/Gj6JDdqgyjwTJm3GPgOuJGdUPdNV6/UCNceAWi59VLH1DU2OF+vX7MoumXjvWyy6lnpbqh7iFm1MNwV7MAoIuJ38R+vw9cYD8RIrBwcoQ55lHQ9WwRmoZNkwG8BLd4BQBzL4vhPnBXxCCUM+MeBl3P9eqGOtOtU16CWzy6FQcA9H/0JNeNBlKlVRle6xIC4mO5bOXxImj1ToMJOHpyt58u2/OWrySFh65gSKr5hqImliXU/UcREDQAQlKJRSQhVdGiAgFRDopVW1RN+W1C3f+g2faav2z8xEFVi1UyL+JjwkIIFk+87bcb8LT4SkZ44e6eNmYwC/yckOwHFC0KCvH9R4vzvRZm1AW89Ek+GO7ueYoZtQAugBMQX+GiKywHhGAx3IYnrJ4nHtRwdw9mi8wCgNZwd88LzAlpwECKJITR0ompz+LYgSzOKYbPsc4LUU5T4YW7e74S7u65kwrCCb4DAMk9KE3h7p5rrb4nlsjz8y4AP5EQZhXLrVzjdqDFdDkh3N2zXlfwZgcAbAeAVwDg95G21l7mB/Ik3N2DK7O1ulcZB4BjI22taTMOsPoyAeFZv+zu9jvzpCo49eBrxXI7twtNw65ZvlRNS/QP/NH0z9kA8PVwd88oALwPANsAAN3C/4q0tTI5i1YJd/fcYxAdUkl98bQZB5IQflRWI1x0DhFQDxbT7aDVW+VWOlkqi3cLAHyPOZAatIpYJ2BFpK311ZRnse/TjHnFdH5nBH/Lx6WyetO1TMbucqrsOQfgw9oYzI9+IL6xQADGhQAcCC6AferkofEAEeEwIFCVGIZKJeblwklXCk3DrgRbUgkP53ZbmAOZiQHAXyNtrUsynRnu7qkDgH4ASDc/64i0ta5kRqd3AUyqWizEHOAUjLOV6Q2xg8EFsEcZx2YooGpy2rfDc4imwlGCBAtiQ14T4SahaThdv4eCYSo8mBYGupLHMges8UakrfWUVGdaFN3UBxNpa2U+mK7+5uUExAezyUzBfWWEBBRVi6aMfgokpGhaQuQZLywCCQLRZFCB5NQ2DKZ3dECVIMEibwnwdDeKJaWa4yE9AHAVM2qND4e7e56PtLUyFYnD3T0YTeq1IDrE1KIFhKofJtT9zHgSur9OlYTK9yWx/O3JxC7cqjOgaQq0N/SmzNfDYA39Z3154KhLZWXyxOn9ern1qCsmVC2e991ooMI+NQ5/DRwDJ5QJcOKEJ0pjLqfl6h0lncWbTQMoZvMvq1wRaWv9neF1cZG81eLP74i0tR6jH6C7xWe4wSgMTK4IilVDMWXvfXZ3Q0VBhqSaL8pq5GJFjVVroPCATp6g9asQJGiKDIJk/gg6xbDQNOzUstkhUgoPpkWCormcOWCd0Uhb6xG618tWzMORttYZHwpu9Umo+28lU0uQRAmIh70QV8ZWOdXxFIUfkmpujSsHr9A0OVTqljBfcHd7c+Rtt8XnuLtpuoCeJNLW+lncisUcsE5NuLtHP0e7LEsLyrjCqpa4TBLCezVQr2xrWC+df9qfW5xsM4w7zVsXPXbVhac/Xa6BcmVAqNpFLS4nByJqFHrDJ7q988Hx/M20wqOcTxe0c0WfIfCxLF+DeV9Fi3x+Wf2Tc9obel3PucNrWFrfPVcDZTF+GRDgHmguoPgGwgvcvIS068WFIKPw6LrcBWYisEAs0taaMphhAWYNz865m11gwAa/DIJi9fXYadVr1+cHsHL1SOhIt66UiZwXGsaVMwPTxMLdPU0A0J3lEkO+NeFs2zFMXV60vi3nhcsbcWyPohw+qiiHhwRhsk6SduxRlPcGYvFXab/ugVSL96nAtsZd/c33B4RZPbI68U88lc06mAixkYThEwTcmO9VYTNOJ+d5aYMrZtCAywUW52r/HmlrvSn5n3B3D4ZtTRfETUibuWLhOusbQ6Grdivyp4cS8lEVgqBOqKql3RiHCYJ2QFVJtShE54ji4GA8gX3C12eTGvf0q5f9a1Qe/TnfqmQdlytXX+pkC+icaq7Q6CTOsdAK1jAnTPNSpK210fBzzFJAGpift3Bd8+rLgrcOy/LlE6pWHtc0Wy3OXEncW07IPUMJeaWVLwSMgOKWJdw9waOf1nCxtoujSdN5FzsKd/f8GwB8nm6tR0GOAcDDkbbWVczJ0+fvBIBM1bhwPtlkNe+TCu4PA7H4mczBAhAiRK0LSL1vxRPLM1nB6cJL1WsSyv5zcAGZkx60emcp70FNPMYcKzAPC03Dy516M8erjNHE6K40Te1RdF+JtLX+njnCvtaU4F6PJ86w27pZpb4s+PJALP6ZTAJ8ctNF6xPK/o/zeV9mjhaCUD/huNV7XmgadmxZwfH5B93Phy4nNvYY1R3COd1L1NKlFR26uv/S8/wD6LailXNLdAi1slvweqgLbgquN4pC+CfT6WycdOwugU/I9bqayV3uVgMXGDSpFoUNE6oWjnuoJmiQEKgQSGRMUS9Mt4TyxMYl96ta9Cq+nSk950e3OR3ddDR1zFcFbU9c9+zK7bLi6e6fQUK0I0XhJ28vPTdl+QrqdvI5XwpwJ0RjYhiqEwnzEwr1vk3DjnlOjgiPWrV5dKFS745tpX/SrpmhC1cXkHq2y/IZfuibgdbvuIC0eTCeaE51X+sGLng5oR48gznAmQL3/jkdYCkK4YW7e1pOCgZu260oZ48paggfRjPXsEIg2oSqkbmSuL9CEJ4ajCdu0LudKLq5kvjOTlnxXUEjXH7YKSsLzMQ3XR2tYqusTqQKMpU0xt3uTuBr4YW7e5ZXi8LqCVWrNBNaJtBVO0YSR4YS8hVoCf0quiRUfOdF2lqZrAhahLefbzNi4cKzCAY96gLS4ztl5Tg7gh4iAQgAkaOaZimtzctUi8L4mKKaVk3DbU6yeuBWHmyZiQvCc7QMhC3LCWc8tf66ICH9wwnZFtHB1C4EgGIQHTKmqJVouc2WG5bWd39XEiq3MT9U4lQrUac/AOZLsZDkLbxFT63/w2BC/rGba2l+AN3lYyTxFbNLTagHmRIZpQxGNYudvISHotuSSHyai84auxV1AV34nwFurg1JNQ96/PIdA+u7zJKdXUqgO1IcI2fhoXu5LSFf5r+22O6Bbvjr8cRyjPgaLyIqj3bwvXzTBEnAja1B3nc1MZDyejxxF7d02YOfWbUorDXO99obeveJQvlqXkYC4AjiymOVMtuoEOQkvLmS+AwzyLHMhKqF6suCncbzZXX8dvS0SvmTxC+eYxLvMuMO4GitwayFhy7mbsW/62peAF3OgVj8SmM3JrR6AXHWoyX7wWBJBCK6sSVov9A07G3h7VSU7/N5nT3glibjC8WVfTf49HZsYR5JXxK+QDjqZkK2wsOslAOqalrdmZM9uKXIxOptxZKBpfhxiiDA/Igr1aW9LbxTgoGbubWzl4XBwI+ML5hQ938bm32UElig+GSIulXY1rFaK0ksCw+jcK/HEycwBzh5sT0hf9Lk59dk6sJTbOAWqbdJJfRXngw7y8qdLHA77PT8DrK0eC1Bd8K8RY1IQAh398woqIpBFiyQW2qfRUKLw04lAgPiXHgydNyUCLEHX4Fx3NpBNsKrLwte5KUd38UCbomqLwvebLwdSQg/XqqfSdLaowj/Jh0Nf688CaJiwb70TYtyFRrLwhvXNEcqeJUib8YTDcbbjsqjvxaIy608PAC6oO8rk/Bc2TzYUW57pelNbriZkJWrqWmZSvJxckcwNHeZKguvai638vAQqqbAJiiHgYqFdl6UK9YOshGearHcOyd7otOpd0z+piRU5NMspujAPYvvqbJd4ht2q/85uFHej2NOfVnwc8YDAgl4omWql0DX0ybxudptigvPI4yr6vHGKxGF8jdL9fNIx7T4EvnM+fa76WZClsJzfEtwKbFdVpjd6ZOJnRtK/XNJBbqdr0JFrtHO24SmYUe3ARnJOG/DhfOFwUDvdlmpZQ5ybCNFmQvP9QL0Eioo8Hr5SdAwnpVjgHM7V60dZLJ4GGkLEfL+YDzxEb73zh0ICZb8kkI6dinRbK2eY41J0pFSeJhNESLkHym+iTk2UyOKitnOdAEkvis9DTjfezNkuY3zT4SmYccTos0wFRVdU3osyjNVHCNAeH2/XNmlWsprHca5HTPqEozFw20qaOm8coEcTiY0IsBBiXmUjVzidkBFD3O1R4riS1FNY8Y5hSWhgelERdVivAhLBjC3c5+YdpvotU72N7fCDIFhN559qmp7QhwnM6OKIhqjmJg2poFylUDKIoT9juToOBBMOc972AtRTCOHSrjjskGIkD3c2rlHpK3V1OohaweWrZTVcU+3KHOTeVIVnHrwNeMVOFqWPRsOiQyrXnHReZdl9Wux397pklCxv9Q/CzP2qZPG0U1m+a9e4ZDQ3ownvujViywFFgak0Uy32d7QOyCrE/NKcZNsJipJmf6MKdF5KZhiZEp4uGYn8kmEq1QKwhYr74+702U1soCLbyZlcGi50/Oig6TwTgoGrsGd0MxRjmNgxbEF657d9y89zz9htpCu5wPxcbczSVUCl+ngYT+IDpLBlaPXPjOJXVuZoxxXwNo2FQLBnnpfiLS1pqwJgo0tAWAjc6DEQGftbPm9R444638/75c7n7J4XHTeAmvbYE89kcBji55a/5pZXz2gcz5JqFxV6rMEgQRifhId0JIDLZgnyBzhuA7WMMUE9WpR2GEsDZEEo52EBEp6y5YolP+ZGfQ4U1+VB1SVZ0d4mDFFDYcIecVYdTpJQKi4hZgnvpQEfix7PyU8XrbP+0Q1TZwriaY5tEtOe/xuQoJx5kAJEJJqXsay9367U76E4CP2KOrhZh1lYaowUnlJ1uGMyqOfYQZ9wJTw5kpiadUL9ymp2nvBtLt1Xyk1tcSAEgaW/GjtgApv605ZMd2Xx/Em9WXBW40XRhOqS+Y3Jgrhd2ganS8RIm2tW0OE8KimjxiW5cvNrjYgVHl+4dgOMGtHVsfP8PM9TLma8wPSEHOE41kwymnmbmqg7Cn239q06CILMHuHOegjpoQX1bTf+vkmSo3DBAHD0IzwJCFUtPmbOKcTSXh3MYgOkjVXhhLygwDAzBs43uSAqpou2omkOBOnCQhamXT4Q62LHruKOehTpiwezvMWBgObi+WmSpWYstfWjh5ug0kBAWHWNg3UhmISHeirjA3GEyuChDzL62d6H3Q1D6gqc50ExApm0GegS4kl+3BhPCqP3rC0/glPlOOzm0ML6JG21vXHBaT/KZo7K2Koq8msX8nqeI1f71ogZdGQdMRaDdRLAaC6ddFjZ+ESCXNikTBj/W4wnmgPETKI6UnFesPFQLUoRHYsO2+G8Lr6m+cREHz7ewuKs15rXfSnC5gDRcqMlDGc6320LPjVICE8edPDzBHFvxivLiBUXamBedDFD8hq9PBS+h0yuZrPf+LjvzxSFH5SuJbTnHzAL8XBeILJxtcgcbWfP1gC4hxmsIhhhIe8vfTcaxcGAs9zy+c9TgkGXkHPRH9h6GYqarS61D8bP2EqPGTjkpaWhQHpW1x83gFT+wZi8SXGCwpJNX/ws5tZiqQUHvLKkpa745p2brUoRLEOCMc98AswqmmXRdpaZ2RtYN2VmLzX13mLMNWODEpqh0xa4QFdZhhT1LmnBAMPhghhF484BQdFh96HWeEjSQg/UwzWTtWUkqqYZmkjLH7Lvth6zlVRTZszPyDdMVcS93MX1DlQdOh9GN+w59VLH1CKJBoYECt3MINFzKHeCdlCs+NbGkOhK7fLiaODhMwZSsim1bA42UNL/EXGFLUp0tbKdLp5atPF18WVfT8ulrkdbmr18/66bMlZeEZoCbox5gAnK6jgonNF8RYzKwfT8zpsJ/wgc8Cn4M55DZTFxZypYsTOnef1NIeQR2FyYK4k7q0VxZcGYvEf7Vv2iZQPIFo6ALiLOeBj6M55xqoXM3YKbzYXXe7slJXV7yw9N22r4Cc3tf8hoRy4jDngc7D/34WnP10Su+eT2GrxmBGOLXT1N7dIQsUaRZ2swsz9YiMoHvZ8qT0pvMiRh5kWXOWvCAjzZXWiKL0JnN9F5fd/wRwocrjwPMragfN7CZCPyep4sd+q0t7Qy6xPFju8oK1nEeZqUPxLpQFx1p+YwRLATuGV1OS4AKSMZBYzfux7YAd2Cm+A53PmRoUgqMYvLoGIVT66hZzwa98DO7BTeFt585PcmFBVwZidIqvRSh/dQk74te+BHdgmPNwjhrsYmAOcjMwPSLuM56harGibhWIkMyTVPFiq1g7sDq4cKYovMYMcK8wIp+NWH0ICRbsThBApGpVHO5gDJYStwnsrnljF53nZQwsK66nXtERRRpyxOK2qxZYVQzXofLAtSTrJ0WufmcDa/swBjil1AWnbG+cvrtMf63n10r9H5dEzzc4H6qqh1dA0OaiB4huBTpVhF8LMLoSu/uaPAcB/AcAxU6mbMNXeFv/Gqct7APDT9obee5kX9DG2/9LGFPXr3OpZAz+n4YT8JePJMXmsId0LlEnVD6pabG5QrLoBLQhzggdB0QXEquf1ouvqb67r6m/eCQC9+B2EVehpUkfybwwwnQgA93T1N8t4LhWp77Hd4iEnrnt2cLusLGAOcGaAQZXN5y+eqx/r6m++hID4mLHXHVo5SQhvS6gHz9EHJfyyL8/Y5aerv/nraMly/PLHdJ6PtDf0DjNHfEJB3JTtsnKG13ruea1cIe7gH0rIVxjHQ1LNzUbRYZXloFh1/dL6J+qMkUDsfx4UZ3/Ly5bPRHS4w+KePJ4/tIRbu/qbX2WO+ISCCA9LRUQ17Qwv1GhBdw6XOaoF8QEvie+UYGAd1rPRj3X1N882zu0w7I5uJQqMeRFKUnzMAZeZci+FWa+YtNb6vU1X9tGu/uaD6LIyRzxOwSbmuCAc1bR/ChHiWvUoFD4WacJiTduWnftlWiuUOc9pcNPrQCz+OeZ6pZpOoJG/oDgbuzcdj11yrEQAqTAXExA94WlMt9aas3Zp/RNn6q+/q7+5z+bnDq3fkN/EV5A5nh4sCXGMJL6yW1EXOJHZgsISANSTg4GHB2LxDn05PLyWuZL4zk5Zca1AEH4Z4BeSMVNluveBOCgKZftlNfKpXMsgoNWUhMpXFHVygVs90VH8GiiXme06wCAJDZ7Yjdre0Oub3hEFF16Sc57+678OJhI/PaCqIaUAbxkiRCsXyGS1INw1lJBXGutPJnFTfKlEB9MP5CrMd21v6H2I+cEcmA667L8Tp1hOCRCtXECs+mtcGbsklZVeN3Ch9qHqVphTeTqEy44EUawARZk4dDz5/0hsN+wZ3wjvjfVAQj3AvE4K9rc39Pqi4JZjwksS7u5ZPlcS796jqNX59uLDAEWFQGJ1kvTcQCx+s9kDbYbTVhgyiK5QoPVD9zUmj+GShVAoAaLgJKHi3YR68EuZLPXY+Bvarn0vwujBl2HfZOqucEdWNsKcWWfC0XPOg70HN8Ob7/0HRBLvMueZ8Hh7Q+8l7LC3cFx4SbA84PyAdGWIkCt2KsqxY4oaqhFF5YCqikYx1IiiivVcUKhzJXG8VhTfGIjFH8GtNPk8yIueWv+HbQn5skI348Q6pDtlpcVJ0elBAQaEqmsVLXq9piXK7Vh6MDaQtOoad/U3Z/3ANdTdDjVV08WyD0Tegf0T/wsHJt+CidgOM/FiQG++15caXBOeGeHunhaT4SRbjc067HrPalFYO6FqIbutH1pkjF5iICWV6+s0mAcakmq+IauRi2U1crhAgqqqxS0FO6aXLIhSJlVvjMqj9wHAmlQuZSq6+ptRGDkJ/+MnPwShYA0M734Ct01BebB2hrv69nsPwO5xjN3ArvaG3rnMC3gITwnPTU5c9+zKUUW9WgWQ8hUgLlvUSdIuXKczLhnkwkhjB85bsJbmmtq+Tlu/fLCuCwDMKw/MvVDTEnXGPnVl4uGDMWXvG7I6/jydg6Z9/67+5muwaFp7Q6/pkkE+wZWFRy4HVUvAh6rPgT0HX4M3dq4+dCwgHDb1N50Pau0NvZ5OpePC04Fzv1OCgS+PqerN2QZfMJqKgq0vC748EIvfYIfg4APR4ULxsbhNDx9qALi1tq/TliCMHXT1N2MGyr/hx2CwZjEAuE6fZ9nV34zCzSn0P7v8VJh/5BXQP3wLNNR9f2oM/50CT8/1eM0VHegOYvXmd5aei00SjweAK1FICwPSKHPydMBExrSv+rLg2rimTfXufrH1nLMKJDo9nikTQVO/VqBxNHEhy2iepV5o59AE6KzB+dys8PFTP5YUXFKAJpzHDnmHorZ49MGdbbd75hQjjR3PAUAzdc1wboQtmL9Y29fplfkiCmrIwhf4RHtD76Ed9TQx+ijmLAucvWAlvLat81CEE4V3YHIQBnczDoCn1/WK2uLRB3T5SGPHwEhjx7dHGjvmMSc5CH4RWL2GkcaOP+tEh+sAt9T2dV7kFdFRrGahlOv/QwMfOa1t7Dm4CY447KxD/0fLd/Sc1qnlBwOCl3cyFL2rWdvXeRsNTGAu45aRxo4dI40dd4w0drhR+fqr9BruYI7ooKK7QBeE+EZtX+cPmRPdp9biFZiJ4Ju5uJzDo3+C9w/8fcbYy4M3waJ5Nx0KsOjwbE2Xkpjj1fZ14vrZfDo3+hAAfAcb3tIH3ElupO91fqr3NIguDgCn1/Z13sec6DJd/c1rTOZ06WjVH6MBlxXZig+jlsaFdPz/G9vvg4bjbzeefgrzAh6hZIIr6KLV9nUuBoCb6RA+2BeMNHZsoXPBgjLS2PE1rORH3+NnZu810tiBSQFtOtGdTb80vEhTlte0yDigE1/eKTU79j0FAbHC6HK6OrVIR8mVcEeXbaSx42/YfIeGv/GXs3WksaPF6kOO5wIABj6wffB2AHgTAHA3wao0c7Af6D5vJipJhfkZakW8LjrElipoVHz3dvU3D9Pobc5ZNf1bvgf/ctJqeHqz5zPGSnM5obavEx/8swEg6bNg8diXRho7Ps+cnB78uVMB4FMA8O1UHZMM1u49Y5SVHv+pTyxdrqRNtGxv6K2jSzjP0R3misENVekYHnuH/sFlnkTyBHQ5Ma+zbs6nkkOmy0BeoGSbluCDPdLYsUi3TobW7+GRxo7jcgxk4JdYqmULvbV7Un/Ax6KL0r1wVhnKdB7NrzyXOZABGrhZh19umEzdcPx3YHjPo0CTDTxJSS+gU7dwEf32VOjD/30McFiY9xk3+Epm64UGa4c/82vDMb9auneYkTS0N/SuSn00P9obel+g64RXo9VDl5Pyu0K9Z76UfOYKFd8ZOvEJNKr4agbxZeyfRX++U2ftFOrmJueJ9+rW6a71mXv5n8xIahzZEEjni02RxLsazdc0zRf1AiUvPPhAfGfrXEWRup+78lzvu42mTSXZBNOiq9e5nDh3ucuLSwbpoA+51Zo6jjX5a2/ofZFGSj1diZsLj6KzfPogQBkNunyN+YEM0AyVbxrO+hkV3Ut0Ton8tbav86b0r+ZZEhYvbCUzUkDol0KNlz84LjwdujmfXnwokJ+ONHbcqRtDlzCdG4p0MyPTrbj0ohsDgEuZs/zDQQtXmmhv6GVWtguN10vEc+EZoOK7iAY7kqDreX0y6JJmrW4KzAsFgA8bhqO0rF1QN3aux3Ivs2WThfN/zoxw+H68VNDgR49hySW5H24RtVZ6FOqqzqZrUenAc++p7eu8Js05nqerv/nyDJFD3xQfchouvDRQy/V9E88gZgiaJEExzrKwPjpW29fpWolBO+nqb1ZMPh+g878T/FxmvZCYfWAcCl1If83k8zATHVJtQXT4oH6SGfUvZgWLMQ8x5qkAAA5QSURBVKLYwkWXGi68zLRQC2cXfcm1vCIhbriNZJWvF4voHm2HCy8DNPjxWRvXhf4PM+Jvtuiufhvu+uaWLjNceBao7evEvWd/s+GlnjRLK/M5mBQ5CQCfponOHAvw4IpF6IL4W4blgGzAudAJRSg8Tg5wi2cRKpiVKYIJVujnouMk4cLLApraNZHDj6JYvVgzheMSXHjZc3MOgRaFzhM5nCm48LKE7iKwkqOo51FmhFPScOHlxs1ZzPVwneu/mVFOScOjmjky0tixj9ZcyUhtX6eHuq9zrDC+ev7HaO7tzsoVQ7ZvqOUWL3esZt2/xYxwPM346vlfAYBeGsX+3fjq+ZvHV8+3dY2SCy937rT4k/9gRjhex1j1GivJPWOn+LjwcoSmkmXa/gN0axHH/yzA1vJ2iY8LLz9+nSHIEk1T8o/jP04EgP+w46q58PJjjYVtQH7eYV6qpKv2dv746vldxkEcG189/3L670dMjv9wfPX8P9Lz6nhUM08yRTd5RNOfjK+eP66rh2rGdytXDE11faIR0F8AwDIs4w8AR1euGDqLHsMOmlcbOivdyy1e/mz2+w1wTHnBbFDH9UkLR5cdUHgPA8DdOtFhP7HvmbQzU7nw8ocLrzhJ2eOZgiU+VuqCLSiuUOWKoRdwbHz1/EEAOJP5KYCtlSuGvsGFlz9v+v0GOCwoIGrB0jGXtsdG/pmu+aEQn6FRUCMjAPAF4MEVW0g3EZfdbv/MyZ3KFUPYSXhPhhc4lXYcPg0AHqMt2MxEh4kUZ1NBl263IJsZT9E5ZzzZf485wvH+L3X1fCy/OIc5wHIaHXnTpG8gbiP7feWKoS/rB7nw7CHdWh7Hv2TbN8MoOpz/t1WuGGJq0HBX0x5SfYGZWUFOaYBbx75qJjrgwssfWqovlcBSCZLjD9bmcZXfTc7nzODCKzw8uOJT6Hagf09x9anm7f8DABdWrhhK2yGJfyMXHi48H1O5Yuim8dXzu+kiOST3542vnt9Pf7cRutn5N5Urhq62eqdceIXHOOHm+AzqMh5yG2nGyunU6rWkmselg7uaheeoYr/BEmQH7X+Yk+iAWzwOJ3uMFjAXuMXLE9paOZrmVfLpoc4pUrjw8md2BuFxr4LDwIVXeFKt8XFKGC68wsODKxwGLjx7SNfnO1X3WE4Jw4XH4bgAF17+pLN2SJRGPjmcQ3Dh5Y8VUWUSJ6fE4MIrPCGer8kxwoWXP1ZEdTIzwilpuPCcYWEp3CTHOlx4+WNljseFx5kBF54z8OAKZwY8jzB/rIjK1t5qnNwhhCT30hkzinYBwM80Tctpm0+2cOHlD9/o6nEIIdjb4Bra985YTl3P1wkhTwLAdYUWIHc18yfdLzLJ5EhjRwszyikohJA6QsgfaXfXT1n4XVXS8zYTQi5hTmYPQ/SvgBhLNbq9L1YgRDyFSq6WTa95K8K8SXDhZcfmXaf6/kIM+IMlwLAYuzTRq1VTg8RdbsW64Y8tzZJrdMvbRQd0I5AtzOjecKjmvljde7m1oZY/QL/VAN9QsgSY9SOEHKN4ed2apr2e/hAdMaHz1PC07mXheAy2hHINrjw8iOb5OeU7Zod5sSk+Ki7uFTX7WYGhJD7AeB9ryd50+WCbNzLTanuOQUV6KprmpapWaVluKuZH9k8kG7tyzPr33ciLcZ6Y4YHsMInOysesig6tODzNE2r1zSN0PLs48xZ5tj6u+PCy49sHsqQS0sKO5kRe/CEq0nX6cwaQerBzj0dmqZ9Vu9ia5p2E517v838BAsXnofIdt62lBkpMMl5WgGoMJkXOgqNYGZap0PRoeBMm4hQIV7LHGDJJO6s4MLLj2yF51YJiAlmxB4uc/pGktDo7B3MgZkkRfcEc0QHPf4kc4B9z8uZwRzhwsuPbF1Ht+ZLg8yIPTQRQqxYiynwwSWEPEQIGaBLGxohZJz+/wV67BYaLMnE7TTUn467MolOh5WS7JnezzI8qpkf2SZIuyW8Qi5loKtn6sYloS7h1SkCORW68Sbdz2DkcR2dhxlfD4X5JeaVZvKopmmZLKIeK0GWx5iRHOEWLz+sJEjrcavG5i5mxD6a0r0SDX78MoXo0oHn30itoTFtK1MWDgaUrmNG05Op4veEnTsWuPCcpSh3KZgFWZJ5nTkmKes5jSYsPwQfzO3OZ86aya9zEEkm9zav7kBGuPCcpSwrCyi6JOnmyZtytHafZkZmYvsXJRdefuQiPMeTpTVNQzdphDlgIzSRurPAosvEPRmOpyLd/C5XMaeFu5q5k2uQJJ1LU0gGC/jel9FlATd5UtO0X+X4/qk+F4yOXsyM2gC3eLmTa96lW8nSMjNiH26LDslnDhZhRqZ3MHymUEWPuMXLnVyFl+ylUOhIYzL0fin977MAcA5zUnGwgbrTuXIK/Zzq6ZrnxgLmuE7BhZc7+VgtdFPXMKM2Q7+tVyVflRDyRbuTfT1CXqF+4+fkBNzVzJ18eptnCokXijtdet9C8zO/XTAXXu7U5PGzbtVf6QGA7cyov9niVPVnO+GuZu7kU8rB0TIQdK73VbqkgKHzZ4rI5bQ1o8QpuMXLgZHGjnx3kjuWs0mzMj6Ja1G4GRStg6ZpuHv8UeZkf3LAj1fNLV5u1NNtJLnO88rpaxQ6oyTdDvR1ADAEAEcCwBI795o5TKHT4QoCt3i5MTvP4Aq4UQYiCd28+pamaTdomoZl637EnOQPxu3cI+ckXHi5YUe+5UeZEQcghGBa1TOapvW68f42s8GPgRXgrmbO2JF58iFmpMDQndtYH3Kf4Z1ecfpabKLgSQiFglu83LBjT13c6U2xmN1hIjrIM+vDTbp9et1ceDlih/CCAPDPzKh7bPLQtVhhxMdfGFx42TLS2DEvw56wbLjQQ7dWSLdtpADCfp0Z8RF8jpc99TTT347Pzq3UMTPyKYiE5eBfMnROmhKypmkzciBpxbFv2dC77u/MiI/gwsueFhs/Nwm3CNX2dXohSJCP8BQsj86MmoB75gghmLq2Oc8lmY3MiI/grmb22Ln+JgLAMmbUHfKJbGaVfkaXAO5lDlhnIk1igC/gwsuek2x+vUuYERfIEKiIMSP5k8+OAt8uIyThwsuCkcaOSwqwk/ssG3I/88asNqYO2wviUquXax0YX6aJ6eHCy45PF2BerHjE6uWbApcLuQqaW7wSo70At4vzPNurWOVAumycgidzG8jUV96X+Zl6uPAsQt3M8gK9/AK6PugmriVtm7CfHTqErT0M3IILzzp3FnD5BV/358yoQ9A9e6kqhb3DjLDYWbNzU5pye1AM8zvgwrMGzak8ocBvc76LVq+ZGfmA8QxuKOQxVzObV2YSViE7HzkGF541fuPQZ+VW0m86YVkJZFht4G/EbP0v0/tx4ZUCI40dD2RwfezkwyONHd928mOlW4XS9biz8qBn7f6laWucKZDDXc1iZ6Sx42sA8EUaeXQC/H38wKlK04QQnLf+kTkwk105NJW0glmjkIkMC/mQh3X1FFx4JuCC9khjx3MAsNpB0el5qZDiw0RlQggK6kYL1txKKllWYqBWdglzwJpb69dNuzPgwjNArdwumgzt1ucTLLD4vm/RfcYIo5XkZ8vuHxXd/Sm6Cg3S4ynx8x48PVx4FIwojjR2YMb8T1zsVa4nKb5C7FK3Omcdp6523tDWzOjWPpFmSxBavDZmtAgpeeFRtxL3jG0BgFM9tlUKxfdcAQIuVtfdIikskx6rlb7upv3Q073eYxl61VlZU/QFJS08nVv5Teagt/geWmMbXc+rMogPj30XAN5jjrCst5hJkunaR+jrpIuwFkVgBSGapjGDxQzdCfA5jB7SbA0rFi5OrQ/kWcg2iULnRWtoXiJ2iT2dRg+lDAEdrAB9fW1f51bmSJbQkH4zvZ9xek2vJOdRdL61NsX94vmP0rqcGSGEYJuwxWnOe5IW2V3JHPkALOeXziL6hpIRHs0Kwa0v/5c+2OkEh0LTaHABxbE2uUt8pLHjEQC4gvmJ7IjW9nWa5n1Sq7aM9jo4ljnhA/BBvbO2r7OgCcy078K3DOJDgf5ntjmThJDN1J034176uumEd6+maVczoz6k6IVHk5txjnQWc/ADkhbtLQB4WC80k9dbZYNr+lZtX+fJzCj7XvOoyK+mARGjJcS9gQepVfp/dljBQkOt7DJq5ZP94FFw19F//0Yn8uT6IX4BvlAsooNiFt5IY8cfaYQslXXTP7T/XdvXaalR5Ehjx14AqDYMJwAgQLPqk5keR2XoClRd29fJ1LhMBbWEd2BOJ52bJ+9JBYC/4b1m83ocdzF7IIuFmGG+lLRqf6fu42+ztRAjjR3LDVE5fOjHAOBWAHjE+ODrLNaN9Fs8eS0ynWfex7xJCqgFvojOUb9K3b8wAHTU9nVafh2ONyhmi4cP6Kv0gc/KqplBX2+rzoqhkG+r7ev8ocnpDCONHXdSASbZX9vXmVfJBxS2H9xLDkvJRTVzhSZLf4FaURTd2anmgamg7uJL1PJiZPM7VoXLKS648CxAs0eepq4izufOyrUWJn2tHp2AT+JWq/Qo+cyVTFAXcx0VHc7pvptPAVoa/r+XzvOCdL7JKTG48DKjL3s3ZpNreBtugaHu5uEeqLfCcRjualqEzs/22eUW0vXFrR4p385xEgD4/3jnmVnPaw0lAAAAAElFTkSuQmCC';
    const DEFAULT_PERIODS = '';
    const PLANEACIONES_PAGE_SIZE = 30;

    const state = {
      config: {
        periodConfig: DEFAULT_PERIODS
      },
      session: null,
      catalogos: {
        alumnos: [],
        facilitadores: [],
        facilitadores_admin: [],
        facilitador_asignaciones: [],
        grupos: [],
        niveles: [],
        materias: [],
        materias_admin: [],
        submaterias: [],
        submaterias_admin: [],
        habilidades: [],
        talleres: [],
        talleres_admin: [],
        alumno_talleres: [],
        refuerzos: [],
        periodos: [],
        semanas: []
      },
      catalogosMeta: {
        loadedBlocks: [],
        revision: 0
      },
      planeacionOutbox: [],
      planeaciones: [],
      alertas: [],
      notificaciones: [],
      openPlanId: '',
      openPlanDraft: null,
      multiGroupSharedDrafts: {},
      ui: {
        planBuilderExpanded: false,
        planeacionesLoaded: false,
        planeacionesLoading: false,
        planeacionesLoadingMore: false,
        planeacionesHasMore: false,
        planeacionesOffset: 0,
        planeacionesCatalogosLoading: false,
        planeacionesCatalogosPromise: null,
        planeacionesCatalogosPendingBlocks: [],
        openPlanLoadingId: '',
        tallerMembershipCatalogosPromise: null,
        fastPlaneacionesBootPromise: null,
        planeacionesRestoreLock: false,
        adminModuleLoading: {},
        adminCatalogPrefetchPromise: null,
        adminCatalogPrefetchDone: false,
        adminNotificationsPrefetchPromise: null,
        adminNotificationsPrefetchDone: false,
        notificationEditorExpanded: false,
        notificationFilter: 'activas',
        planeacionesMateriaFilter: '',
        multiGroupActiveChildByLote: {},
        debounceTimers: {},
        adminUiEventsBound: false,
        restoreSnapshotSyncing: false,
        restoreSnapshotSyncJustFinished: false,
        restoreSnapshotSyncFinishedTimeout: null,
        planeacionOutboxProcessing: false,
        planeacionOutboxRetryTimer: null,
        closePlanSyncWatchTimer: null,
        adminModuleErrors: {},
        pendingPlanSaveTransactions: {},
        planDetailPromises: {},
        planeacionDetailPrefetchRunning: false
      },
      alumnosUi: createEmptyAlumnosUiState(),
      facilitadoresUi: createEmptyFacilitadoresUiState(),
      talleresUi: createEmptyTalleresUiState(),
      materiasUi: createEmptyMateriasUiState(),
      reportesUi: createEmptyReportesUiState(),
      maintenanceUi: createEmptyMaintenanceUiState(),
      planEditor: {
        mode: 'create',
        planId: '',
        lockedSemanaId: '',
        lockedGrupoId: '',
        selectedTallerId: '',
        lastKnownUpdatedAt: '',
        lastKnownActivitiesVersion: '',
        activities: []
      },
      notificationEditor: {
        notificacion_id: '',
        titulo: '',
        mensaje: '',
        prioridad: 'normal',
        fecha_inicio: '',
        fecha_cierre: '',
        visible_para: 'todos',
        facilitadores_ids: [],
        estatus: 'borrador'
      },
      activeTab: 'planeaciones',
      activeAdminModule: 'dashboard'
    };

    const inFlightActions = new Map();
    const feedbackAnchors = [];
    let actionToastTimer = null;
    const adminCatalogMemo = {
      materias: { revision: -1, result: [] },
      submaterias: { revision: -1, result: [] },
      talleres: { revision: -1, result: [], byId: new Map() }
    };
    const alumnoSourceMemo = {
      signature: '',
      rows: [],
      byId: new Map()
    };
    const catalogIndexMemo = {
      revision: -1,
      alumnosById: new Map(),
      alumnosByGroupId: new Map(),
      gruposById: new Map(),
      materiasById: new Map()
    };
    const planeacionesIndexMemo = {
      signature: '',
      byId: new Map(),
      latestByFacilitadorId: new Map()
    };

    const SAVE_TRACE_LIMIT = 20;

    function getTraceNow() {
      return (typeof performance !== 'undefined' && performance && typeof performance.now === 'function')
        ? performance.now()
        : Date.now();
    }

    function getSaveTraceStore() {
      if (typeof window === 'undefined') return null;
      if (!Array.isArray(window.__laSaveTrace)) window.__laSaveTrace = [];
      return window.__laSaveTrace;
    }

    function beginSaveTrace(label, meta = {}) {
      const store = getSaveTraceStore();
      const start = getTraceNow();
      const trace = {
        id: uid('SVTR'),
        label: String(label || 'save').trim() || 'save',
        started_at: new Date().toISOString(),
        start_ms: start,
        end_ms: null,
        duration_ms: null,
        status: 'running',
        meta: Object.assign({}, meta || {}),
        events: []
      };
      if (store) {
        store.push(trace);
        while (store.length > SAVE_TRACE_LIMIT) store.shift();
      }
      markSaveTrace(trace, 'start');
      return trace;
    }

    function markSaveTrace(trace, name, data = {}) {
      if (!trace) return null;
      const now = getTraceNow();
      const event = {
        name: String(name || '').trim() || 'mark',
        at_ms: now,
        elapsed_ms: Math.round(now - trace.start_ms),
        data: Object.assign({}, data || {})
      };
      trace.events.push(event);
      return event;
    }

    function endSaveTrace(trace, status, data = {}) {
      if (!trace) return null;
      const now = getTraceNow();
      trace.end_ms = now;
      trace.duration_ms = Math.round(now - trace.start_ms);
      trace.status = String(status || 'done').trim() || 'done';
      if (data && Object.keys(data).length) trace.result = Object.assign({}, data);
      markSaveTrace(trace, 'end', Object.assign({ status: trace.status }, data || {}));
      try {
        if (typeof console !== 'undefined' && console && typeof console.debug === 'function') {
          console.debug('[LA_SAVE_TRACE]', JSON.parse(JSON.stringify(trace)));
        }
      } catch (_) {}
      return trace;
    }

    const $ = (id) => document.getElementById(id);

    function ensureAdminShellMarkupLoaded() {
      if ($('adminShell')) {
        startAdminTextNormalizer();
        return true;
      }
      const mount = $('adminShellMount');
      const template = $('adminShellTemplate');
      if (!mount || !template || !template.content) return false;
      mount.replaceChildren(template.content.cloneNode(true));
      startAdminTextNormalizer();
      return !!$('adminShell');
    }

    function normalizeMojibakeText(value) {
      let text = String(value == null ? '' : value);
      if (!/[\u00c2\u00c3\u00e2\ufffd?]/.test(text)) return text;
      [
        [/\u00c3\u00a1/g, '\u00e1'],
        [/\u00c3\u00a9/g, '\u00e9'],
        [/\u00c3\u00ad/g, '\u00ed'],
        [/\u00c3\u00b3/g, '\u00f3'],
        [/\u00c3\u00ba/g, '\u00fa'],
        [/\u00c3\u00b1/g, '\u00f1'],
        [/\u00c3\u00bc/g, '\u00fc'],
        [/\u00c3\u0081/g, '\u00c1'],
        [/\u00c3\u0089/g, '\u00c9'],
        [/\u00c3\u008d/g, '\u00cd'],
        [/\u00c3\u0093/g, '\u00d3'],
        [/\u00c3\u009a/g, '\u00da'],
        [/\u00c3\u0091/g, '\u00d1'],
        [/\u00c2\u00bf/g, '\u00bf'],
        [/\u00c2\u00a1/g, '\u00a1'],
        [/\u00c2\u00b7/g, '\u00b7'],
        [/\u00e2\u20ac\u0153/g, '"'],
        [/\u00e2\u20ac\u009d/g, '"'],
        [/\u00e2\u20ac\u2122/g, "'"],
        [/\u00e2\u20ac\u201d/g, '-'],
        [/\u00e2\u20ac\u201c/g, '-'],
        [/\u00e2\u0153\u201c/g, '\u2713'],
        [/\u00e2\u0153\u2022/g, '\u00d7'],
        [/\u00c2/g, '']
      ].forEach(([pattern, replacement]) => {
        text = text.replace(pattern, replacement);
      });
      return text
        .replace(/Planeaci\?nes/g, 'Planeaciones')
        .replace(/planeaci\?n/g, 'planeacion')
        .replace(/sesi\?n/g, 'sesion')
        .replace(/pedag\?gico/g, 'pedagogico');
    }

    function normalizeAdminTextNode(node) {
      if (!node || node.nodeType !== Node.TEXT_NODE) return;
      const next = normalizeMojibakeText(node.nodeValue);
      if (next !== node.nodeValue) node.nodeValue = next;
    }

    function normalizeAdminElementText(root) {
      if (!root || !canUseAdminShell()) return;
      const skipTags = new Set(['SCRIPT', 'STYLE', 'TEMPLATE']);
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          const parent = node && node.parentElement;
          if (!parent || skipTags.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      });
      let node = walker.nextNode();
      while (node) {
        normalizeAdminTextNode(node);
        node = walker.nextNode();
      }
      root.querySelectorAll('[placeholder], [title], [aria-label]').forEach((el) => {
        ['placeholder', 'title', 'aria-label'].forEach((attr) => {
          if (!el.hasAttribute(attr)) return;
          const current = el.getAttribute(attr);
          const next = normalizeMojibakeText(current);
          if (next !== current) el.setAttribute(attr, next);
        });
      });
    }

    function startAdminTextNormalizer() {
      const shell = $('adminShell');
      if (!shell || shell.dataset.textNormalizerReady === 'true') return;
      shell.dataset.textNormalizerReady = 'true';
      normalizeAdminElementText(shell);
      if (typeof MutationObserver !== 'function') return;
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'characterData') {
            normalizeAdminTextNode(mutation.target);
            return;
          }
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE) {
              normalizeAdminTextNode(node);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
              normalizeAdminElementText(node);
            }
          });
        });
      });
      observer.observe(shell, {
        subtree: true,
        childList: true,
        characterData: true
      });
    }

    function tryShowDatePicker(input) {
      if (!input || input.disabled || input.readOnly) return;
      if (typeof input.showPicker !== 'function') return;
      try {
        input.showPicker();
      } catch (_) {}
    }

    const escapeHtml = (value) => String(value == null ? '' : value)
      .replace(/\u00C2\u00B7/g, '\u00B7')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

    // Escapa valores cuando terminan dentro de una cadena JS en atributos HTML.
    const escapeJsAttrValue = (value) => String(value == null ? '' : value)
      .replace(/\\/g, '\\\\')
      .replace(/\r/g, '\\r')
      .replace(/\n/g, '\\n')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '\\\'');

    function uid(prefix = 'RID') {
      return prefix + '-' + Math.random().toString(36).slice(2, 10).toUpperCase();
    }

    function createEmptyCatalogos() {
      return {
        alumnos: [],
        facilitadores: [],
        facilitadores_admin: [],
        facilitador_asignaciones: [],
        grupos: [],
        niveles: [],
        materias: [],
        materias_admin: [],
        submaterias: [],
        submaterias_admin: [],
        habilidades: [],
        talleres: [],
        talleres_admin: [],
        alumno_talleres: [],
        refuerzos: [],
        periodos: [],
        semanas: []
      };
    }

    function createEmptyCatalogosMeta() {
      return {
        loadedBlocks: [],
        revision: 0
      };
    }

    function getCatalogosRevision() {
      return Number(state.catalogosMeta && state.catalogosMeta.revision || 0);
    }

    function getCatalogIndex() {
      const revision = getCatalogosRevision();
      if (catalogIndexMemo.revision === revision) return catalogIndexMemo;

      const alumnosById = new Map();
      const alumnosByGroupId = new Map();
      const gruposById = new Map();
      const materiasById = new Map();

      (state.catalogos.alumnos || []).forEach((alumno) => {
        const alumnoId = String(alumno && alumno.alumno_id || '').trim();
        const grupoId = String(alumno && alumno.grupo_id || '').trim();
        if (alumnoId) alumnosById.set(alumnoId, alumno);
        if (grupoId) {
          if (!alumnosByGroupId.has(grupoId)) alumnosByGroupId.set(grupoId, []);
          alumnosByGroupId.get(grupoId).push(alumno);
        }
      });
      (state.catalogos.grupos || []).forEach((grupo) => {
        const grupoId = String(grupo && grupo.grupo_id || '').trim();
        if (grupoId) gruposById.set(grupoId, grupo);
      });
      (state.catalogos.materias || []).forEach((materia) => {
        const materiaId = String(materia && materia.materia_id || '').trim();
        if (materiaId) materiasById.set(materiaId, materia);
      });

      catalogIndexMemo.revision = revision;
      catalogIndexMemo.alumnosById = alumnosById;
      catalogIndexMemo.alumnosByGroupId = alumnosByGroupId;
      catalogIndexMemo.gruposById = gruposById;
      catalogIndexMemo.materiasById = materiasById;
      return catalogIndexMemo;
    }

    function getPlaneacionesIndex() {
      const rows = Array.isArray(state.planeaciones) ? state.planeaciones : [];
      const signature = rows.map((plan) => [
        plan && plan.planeacion_id,
        plan && plan.facilitador_id,
        plan && (plan.fecha_actualizacion || plan.fecha_creacion || ''),
        plan && plan.estado,
        plan && plan._local_save_state,
        plan && plan.actividades_version_actual,
        plan && plan.detail_loaded,
        plan && plan.obs_loaded
      ].join('|')).join('::');
      if (planeacionesIndexMemo.signature === signature) return planeacionesIndexMemo;

      const byId = new Map();
      const latestByFacilitadorId = new Map();
      rows.forEach((plan) => {
        const planId = String(plan && plan.planeacion_id || '').trim();
        if (planId) byId.set(planId, plan);
        const facilitadorId = String(plan && plan.facilitador_id || '').trim();
        if (!facilitadorId) return;
        const currentValue = String(plan.fecha_actualizacion || plan.fecha_creacion || '').trim();
        const previous = latestByFacilitadorId.get(facilitadorId);
        const previousValue = previous ? String(previous.fecha_actualizacion || previous.fecha_creacion || '').trim() : '';
        if (!previous || currentValue.localeCompare(previousValue) > 0) {
          latestByFacilitadorId.set(facilitadorId, plan);
        }
      });

      planeacionesIndexMemo.signature = signature;
      planeacionesIndexMemo.byId = byId;
      planeacionesIndexMemo.latestByFacilitadorId = latestByFacilitadorId;
      return planeacionesIndexMemo;
    }

    function getAlumnosSourceRevision() {
      return Number(state.alumnosUi && state.alumnosUi.sourceRevision || 0);
    }

    function bumpCatalogosRevision() {
      if (!state.catalogosMeta || !Array.isArray(state.catalogosMeta.loadedBlocks)) {
        state.catalogosMeta = createEmptyCatalogosMeta();
      }
      state.catalogosMeta.revision = Number(state.catalogosMeta.revision || 0) + 1;
    }

    function bumpAlumnosSourceRevision() {
      if (!state.alumnosUi) state.alumnosUi = createEmptyAlumnosUiState();
      state.alumnosUi.sourceRevision = Number(state.alumnosUi.sourceRevision || 0) + 1;
    }

    function getCatalogBlockKeys() {
      return Object.keys(createEmptyCatalogos());
    }

    function normalizeCatalogBlocks(blocks) {
      const valid = new Set(getCatalogBlockKeys());
      const raw = Array.isArray(blocks)
        ? blocks
        : String(blocks || '').split(',');
      const seen = new Set();
      return raw
        .map((item) => String(item || '').trim())
        .filter((item) => item && valid.has(item) && !seen.has(item) && (seen.add(item) || true));
    }

    function markCatalogBlocksLoaded(blocks) {
      const normalized = normalizeCatalogBlocks(blocks);
      if (!state.catalogosMeta || !Array.isArray(state.catalogosMeta.loadedBlocks)) {
        state.catalogosMeta = createEmptyCatalogosMeta();
      }
      const seen = new Set(state.catalogosMeta.loadedBlocks || []);
      normalized.forEach((block) => seen.add(block));
      state.catalogosMeta.loadedBlocks = Array.from(seen);
    }

    function mergeCatalogosPayload(partial, requestedBlocks) {
      if (!partial || typeof partial !== 'object') return;
      const merged = Object.assign(createEmptyCatalogos(), state.catalogos || {});
      Object.keys(partial).forEach((key) => {
        const incoming = partial[key];
        const existing = merged[key];
        // Avoid clobbering a populated array with an empty incoming array.
        // The boot/refresh path can legitimately echo back empty catalog blocks
        // (e.g. include_catalogos:false) and that should not erase fresh data
        // we already merged from snapshot or a previous load.
        if (Array.isArray(incoming) && incoming.length === 0 && Array.isArray(existing) && existing.length > 0) {
          return;
        }
        merged[key] = incoming;
      });
      state.catalogos = merged;
      const loaded = requestedBlocks && requestedBlocks.length
        ? requestedBlocks
        : Object.keys(partial);
      markCatalogBlocksLoaded(loaded);
      bumpCatalogosRevision();
    }

    function isCatalogBlockLoaded(blockKey) {
      return !!(
        state.catalogosMeta &&
        Array.isArray(state.catalogosMeta.loadedBlocks) &&
        state.catalogosMeta.loadedBlocks.includes(String(blockKey || '').trim())
      );
    }

    function getMissingCatalogBlocks(blocks) {
      return normalizeCatalogBlocks(blocks).filter((block) => !isCatalogBlockLoaded(block));
    }

    function hasCatalogosLoaded() {
      return !!(
        state.catalogosMeta &&
        Array.isArray(state.catalogosMeta.loadedBlocks) &&
        state.catalogosMeta.loadedBlocks.length
      );
    }

    function hasCatalogBlocksLoaded(blocks) {
      return getMissingCatalogBlocks(blocks).length === 0;
    }

    function getCatalogBlocksForModule(moduleName) {
      return getCatalogBlocksForModuleWithScope(moduleName);
    }

    function getPlaneacionesSurfaceCatalogBlocks() {
      return canUseAdminShell()
        ? ['facilitadores', 'grupos', 'materias', 'semanas']
        : ['grupos', 'materias', 'semanas'];
    }

    function getPlaneacionesEditorCatalogBlocks() {
      return canUseAdminShell()
        ? ['alumnos', 'facilitadores', 'grupos', 'materias', 'submaterias', 'semanas', 'talleres', 'alumno_talleres']
        : ['alumnos', 'submaterias', 'talleres', 'alumno_talleres'];
    }

    function getCatalogBlocksForModuleWithScope(moduleName, options = {}) {
      const scope = String(options && options.scope || '').trim();
      switch (String(moduleName || '').trim()) {
        case 'planeaciones':
          return scope === 'editor' ? getPlaneacionesEditorCatalogBlocks() : getPlaneacionesSurfaceCatalogBlocks();
        case 'alumnos':
          return ['alumnos', 'grupos'];
        case 'notificaciones':
          return ['facilitadores'];
        case 'reporte-ciclo':
        case 'reportes':
          return ['alumnos', 'periodos'];
        case 'facilitadores':
          return ['facilitadores', 'facilitadores_admin', 'facilitador_asignaciones', 'grupos', 'materias', 'semanas', 'talleres_admin'];
        case 'materias':
          return ['materias', 'materias_admin', 'submaterias', 'submaterias_admin'];
        case 'talleres':
          return ['talleres', 'talleres_admin', 'alumno_talleres', 'materias', 'facilitadores', 'facilitadores_admin'];
        case 'seguimiento':
          return ['alumnos', 'materias', 'submaterias', 'habilidades', 'periodos'];
        default:
          return [];
      }
    }

    function getAdminModuleCatalogBlocks(moduleName) {
      const normalized = String(moduleName || '').trim();
      if (normalized === 'planeaciones') return getCatalogBlocksForModuleWithScope(normalized, { scope: 'surface' });
      return getCatalogBlocksForModuleWithScope(normalized);
    }

    function adminModuleNeedsCatalogos(moduleName) {
      return ['planeaciones', 'alumnos', 'notificaciones', 'reporte-ciclo', 'facilitadores', 'materias', 'talleres'].includes(String(moduleName || '').trim());
    }

    function getAdminCatalogPrefetchModules() {
      return ['alumnos', 'materias', 'talleres', 'facilitadores'];
    }

    function hasAdminCatalogPrefetchWork() {
      return getAdminCatalogPrefetchModules()
        .some((moduleName) => getMissingCatalogBlocks(getAdminModuleCatalogBlocks(moduleName)).length > 0);
    }

    function hasAdminNotificationsPrefetchWork() {
      return !Array.isArray(state.notificaciones) || state.notificaciones.length === 0;
    }

    function scheduleAdminCatalogPrefetch(delay = 520) {
      if (!canUseAdminShell() || !state.ui) return;
      if (state.ui.adminCatalogPrefetchPromise || state.ui.adminCatalogPrefetchDone) return;
      if (String(state.activeAdminModule || '').trim() !== 'dashboard') return;
      if (!hasAdminCatalogPrefetchWork()) {
        state.ui.adminCatalogPrefetchDone = true;
        return;
      }
      scheduleUiDebounce('admin-catalog-prefetch', () => {
        if (!canUseAdminShell() || !state.ui || state.ui.adminCatalogPrefetchPromise) return;
        if (state.ui.adminCatalogPrefetchDone) return;
        if (String(state.activeAdminModule || '').trim() !== 'dashboard') return;
        if (!hasAdminCatalogPrefetchWork()) {
          state.ui.adminCatalogPrefetchDone = true;
          return;
        }
        state.ui.adminCatalogPrefetchPromise = prefetchAdminCatalogsSequentially()
          .finally(() => {
            if (!state.ui) return;
            state.ui.adminCatalogPrefetchPromise = null;
            state.ui.adminCatalogPrefetchDone = !hasAdminCatalogPrefetchWork();
          });
      }, delay);
    }

    function scheduleAdminNotificationsPrefetch(delay = 1100) {
      if (!canUseAdminShell() || !state.ui) return;
      if (state.ui.adminNotificationsPrefetchPromise || state.ui.adminNotificationsPrefetchDone) return;
      if (String(state.activeAdminModule || '').trim() !== 'dashboard') return;
      if (!hasAdminNotificationsPrefetchWork()) {
        state.ui.adminNotificationsPrefetchDone = true;
        return;
      }
      scheduleUiDebounce('admin-notificaciones-prefetch', () => {
        if (!canUseAdminShell() || !state.ui || state.ui.adminNotificationsPrefetchPromise) return;
        if (state.ui.adminNotificationsPrefetchDone) return;
        if (String(state.activeAdminModule || '').trim() !== 'dashboard') return;
        if (!hasAdminNotificationsPrefetchWork()) {
          state.ui.adminNotificationsPrefetchDone = true;
          return;
        }
        state.ui.adminNotificationsPrefetchPromise = scheduleAfterPaint(
          () => refreshNotificaciones({ force: true, limit: 100 }),
          140
        )
          .then(() => {
            if (String(state.activeAdminModule || '').trim() === 'dashboard') {
              renderAdminShell();
              renderInstitutionalNotices();
              syncRoleUi();
            }
          })
          .catch(() => null)
          .finally(() => {
            if (!state.ui) return;
            state.ui.adminNotificationsPrefetchPromise = null;
            state.ui.adminNotificationsPrefetchDone = !hasAdminNotificationsPrefetchWork();
          });
      }, delay);
    }

    async function prefetchAdminCatalogsSequentially() {
      if (!canUseAdminShell()) return;
      for (const moduleName of getAdminCatalogPrefetchModules()) {
        if (!canUseAdminShell() || String(state.activeAdminModule || '').trim() !== 'dashboard') return;
        const blocks = getMissingCatalogBlocks(getAdminModuleCatalogBlocks(moduleName));
        if (!blocks.length) continue;
        try {
          await scheduleAfterPaint(() => refreshCatalogos({ blocks }), 160);
          if (String(state.activeAdminModule || '').trim() === 'dashboard') {
            renderAdminShell();
          }
        } catch (_) {
          return;
        }
      }
    }

    function getCurrentCatalogBlocks() {
      if (canUseAdminShell()) return getCatalogBlocksForModule(state.activeAdminModule);
      return getCatalogBlocksForModule(state.activeTab);
    }

    function currentViewNeedsCatalogos() {
      if (canUseAdminShell()) return adminModuleNeedsCatalogos(state.activeAdminModule);
      return ['planeaciones', 'seguimiento', 'reportes'].includes(String(state.activeTab || '').trim());
    }

    function currentViewNeedsPlaneaciones() {
      if (canUseAdminShell()) return String(state.activeAdminModule || '').trim() === 'planeaciones';
      return String(state.activeTab || '').trim() === 'planeaciones';
    }

    function setPlaneacionesRestoreLock(isLocked) {
      if (state.ui) state.ui.planeacionesRestoreLock = !!isLocked;
    }

    function shouldSkipPlaneacionesTabBootRefresh() {
      return !!(
        state.ui &&
        (state.ui.planeacionesRestoreLock || state.ui.fastPlaneacionesBootPromise)
      );
    }

    function getMaintenanceUi() {
      if (!state.maintenanceUi) state.maintenanceUi = createEmptyMaintenanceUiState();
      return state.maintenanceUi;
    }

    function createEmptyNotificationEditorState() {
      return {
        notificacion_id: '',
        titulo: '',
        mensaje: '',
        prioridad: 'normal',
        fecha_inicio: '',
        fecha_cierre: '',
        visible_para: 'todos',
        facilitadores_ids: [],
        estatus: 'borrador'
      };
    }

    function getReportSelectionState() {
      if (!state.reportesUi) state.reportesUi = createEmptyReportesUiState();
      return state.reportesUi;
    }

    function getSelectedReporteAlumnoId() {
      const ui = getReportSelectionState();
      return String(ui.alumno_id || $('adminReportAlumno') && $('adminReportAlumno').value || $('repAlumno') && $('repAlumno').value || '').trim();
    }

    function getSelectedReportePeriodoId() {
      const ui = getReportSelectionState();
      return String(ui.periodo_id || $('adminReportPeriodo') && $('adminReportPeriodo').value || $('repPeriodo') && $('repPeriodo').value || '').trim();
    }

    function setReporteSelection(field, value) {
      const ui = getReportSelectionState();
      const nextValue = String(value || '').trim();
      if (ui[field] !== nextValue) {
        ui.lastResult = null;
      }
      ui[field] = nextValue;
      const alumnoSelectIds = ['repAlumno', 'adminReportAlumno'];
      const periodoSelectIds = ['repPeriodo', 'adminReportPeriodo'];
      (field === 'alumno_id' ? alumnoSelectIds : periodoSelectIds).forEach((id) => {
        const el = $(id);
        if (el) el.value = ui[field];
      });
    }

    function getSelectedReporteAlumnoRow() {
      const alumnoId = getSelectedReporteAlumnoId();
      return (state.catalogos.alumnos || []).find((row) => row.alumno_id === alumnoId) || null;
    }

    function getSelectedReportePeriodoRow() {
      const periodoId = getSelectedReportePeriodoId();
      return (state.catalogos.periodos || []).find((row) => String(row.periodo_id || '').trim() === periodoId) || null;
    }

    function getReportStatusLabel(status) {
      return ({
        pendiente: 'Pendiente',
        generando: 'Generando',
        listo: 'Listo',
        obsoleto: 'Obsoleto',
        error: 'Error',
        inexistente: 'Sin cach\u00e9'
      })[String(status || '').trim().toLowerCase()] || (status || 'Sin estado');
    }

    function buildReportResultMarkup(data, options = {}) {
      const compact = !!options.compact;
      const warnings = Array.isArray(data && data.warnings)
        ? data.warnings
        : (data && data.warnings_json ? safeJsonParse(data.warnings_json) : null);
      const alumno = data && data._selection && data._selection.alumno_id
        ? (state.catalogos.alumnos || []).find((row) => row.alumno_id === data._selection.alumno_id)
        : getSelectedReporteAlumnoRow();
      const periodo = data && data._selection && data._selection.periodo_id
        ? (state.catalogos.periodos || []).find((row) => String(row.periodo_id || '').trim() === data._selection.periodo_id)
        : getSelectedReportePeriodoRow();
      const alumnoLabel = alumno ? getAlumnoNameLabel(alumno) : '';
      const periodoLabel = periodo ? (periodo.nombre_visible || periodo.periodo_id) : '';

      if (!data) {
        return compact
          ? '<div class="subtle">Todav&iacute;a no hay una consulta de reporte.</div>'
          : '<div class="admin-reporte-ciclo-result-empty"><div><strong>A&uacute;n no hay una consulta activa.</strong><div class="subtle">Selecciona alumno y per&iacute;odo para generar o revisar el PDF.</div></div></div>';
      }

      const status = String(data.status || data.estado || '').trim().toLowerCase();
      const rows = [
        alumnoLabel ? '<div class="admin-reporte-ciclo-result-row"><span>Alumno</span><strong>' + escapeHtml(alumnoLabel + ' - ' + getAlumnoCompactId(alumno)) + '</strong></div>' : '',
        periodoLabel ? '<div class="admin-reporte-ciclo-result-row"><span>Per&iacute;odo</span><strong>' + escapeHtml(periodoLabel) + '</strong></div>' : '',
        data.url ? '<div class="admin-reporte-ciclo-result-row"><span>PDF</span><strong><a class="link-out" href="' + escapeHtml(data.url) + '" target="_blank" rel="noopener noreferrer">Abrir reporte</a></strong></div>' : '',
        data.version_datos ? '<div class="admin-reporte-ciclo-result-row"><span>Versi&oacute;n de datos</span><div class="code">' + escapeHtml(data.version_datos) + '</div></div>' : '',
        data.version_pdf ? '<div class="admin-reporte-ciclo-result-row"><span>Versi&oacute;n PDF</span><div class="code">' + escapeHtml(data.version_pdf) + '</div></div>' : '',
        data.started_at ? '<div class="admin-reporte-ciclo-result-row"><span>Inicio</span><strong>' + escapeHtml(formatFechaHumana(data.started_at)) + '</strong></div>' : '',
        data.finished_at ? '<div class="admin-reporte-ciclo-result-row"><span>Finalizaci&oacute;n</span><strong>' + escapeHtml(formatFechaHumana(data.finished_at)) + '</strong></div>' : '',
        data.next_retry_at ? '<div class="admin-reporte-ciclo-result-row"><span>Reintento</span><strong>' + escapeHtml(formatFechaHumana(data.next_retry_at)) + '</strong></div>' : '',
        data.error_message ? '<div class="admin-reporte-ciclo-result-row"><span>Error</span><strong>' + escapeHtml(data.error_message) + '</strong></div>' : '',
        data._meta && data._meta.message ? '<div class="admin-reporte-ciclo-result-row"><span>Info</span><strong>' + escapeHtml(data._meta.message) + '</strong></div>' : '',
        Array.isArray(warnings) && warnings.length ? '<div class="admin-reporte-ciclo-result-row"><span>Warnings</span><div class="tag-cloud">' + warnings.map((warning) => '<span class="tag">' + escapeHtml(warning) + '</span>').join('') + '</div></div>' : ''
      ].filter(Boolean).join('');

      if (compact) {
        return [
          '<div><strong>Estado:</strong> ' + escapeHtml(getReportStatusLabel(status)) + '</div>',
          data && data.url ? '<div><a class="link-out" href="' + escapeHtml(data.url) + '" target="_blank" rel="noopener noreferrer">Abrir reporte</a></div>' : '',
          data && data.version_datos ? '<div><strong>Versi&oacute;n datos:</strong> <span class="code">' + escapeHtml(data.version_datos) + '</span></div>' : '',
          data && data.version_pdf ? '<div><strong>Versi&oacute;n PDF:</strong> <span class="code">' + escapeHtml(data.version_pdf) + '</span></div>' : '',
          data && data.error_message ? '<div><strong>Error:</strong> ' + escapeHtml(data.error_message) + '</div>' : '',
          data && data._meta && data._meta.message ? '<div><strong>Info:</strong> ' + escapeHtml(data._meta.message) + '</div>' : '',
          Array.isArray(warnings) && warnings.length ? '<div><strong>Warnings:</strong><div class="tag-cloud">' + warnings.map((warning) => '<span class="tag">' + escapeHtml(warning) + '</span>').join('') + '</div></div>' : '',
          data && data.next_retry_at ? '<div><strong>Reintento:</strong> ' + escapeHtml(data.next_retry_at) + '</div>' : ''
        ].filter(Boolean).join('');
      }

      return (
        '<div class="admin-reporte-ciclo-result-head">' +
          '<div><strong>Resultado del reporte</strong></div>' +
          '<div class="admin-reporte-ciclo-status is-' + escapeHtml(status || 'inexistente') + '">' + escapeHtml(getReportStatusLabel(status || 'inexistente')) + '</div>' +
        '</div>' +
        '<div class="admin-reporte-ciclo-result-meta">' + rows + '</div>'
      );
    }

    function resetReportResult() {
      const ui = getReportSelectionState();
      ui.lastResult = null;
      const legacyHost = $('reportResult');
      const adminHost = $('adminReportResult');
      if (legacyHost) legacyHost.innerHTML = buildReportResultMarkup(null, { compact: true });
      if (adminHost) adminHost.innerHTML = buildReportResultMarkup(null);
    }

    function clearLoadedData() {
      if (state.ui && state.ui.planeacionOutboxRetryTimer) {
        window.clearTimeout(state.ui.planeacionOutboxRetryTimer);
        state.ui.planeacionOutboxRetryTimer = null;
      }
      state.planeacionOutbox = [];
      state.planeaciones = [];
      state.alertas = [];
      state.notificaciones = [];
      state.catalogos = createEmptyCatalogos();
      state.catalogosMeta = createEmptyCatalogosMeta();
      state.openPlanId = '';
      state.openPlanDraft = null;
      state.multiGroupSharedDrafts = {};
      if (state.ui) {
        state.ui.planBuilderExpanded = false;
        state.ui.planeacionesLoaded = false;
        state.ui.planeacionesLoading = false;
        state.ui.planeacionesLoadingMore = false;
        state.ui.planeacionesHasMore = false;
        state.ui.planeacionesOffset = 0;
        state.ui.planeacionesCatalogosLoading = false;
        state.ui.planeacionesCatalogosPromise = null;
        state.ui.openPlanLoadingId = '';
        state.ui.tallerMembershipCatalogosPromise = null;
        state.ui.fastPlaneacionesBootPromise = null;
        state.ui.notificationEditorExpanded = false;
        state.ui.notificationFilter = 'activas';
        state.ui.planeacionesMateriaFilter = '';
        state.ui.multiGroupActiveChildByLote = {};
        state.ui.restoreSnapshotSyncing = false;
        if (state.ui.restoreSnapshotSyncFinishedTimeout) {
          clearTimeout(state.ui.restoreSnapshotSyncFinishedTimeout);
        }
        state.ui.restoreSnapshotSyncFinishedTimeout = null;
        state.ui.restoreSnapshotSyncJustFinished = false;
        state.ui.adminNotificationsPrefetchPromise = null;
        state.ui.adminNotificationsPrefetchDone = false;
        state.ui.planeacionOutboxProcessing = false;
        state.ui.pendingPlanSaveTransactions = {};
        state.ui.planDetailPromises = {};
      }
      state.notificationEditor = {
        notificacion_id: '',
        titulo: '',
        mensaje: '',
        prioridad: 'normal',
        fecha_inicio: '',
        fecha_cierre: '',
        visible_para: 'todos',
        facilitadores_ids: [],
        estatus: 'borrador'
      };
      state.alumnosUi = createEmptyAlumnosUiState();
      state.facilitadoresUi = createEmptyFacilitadoresUiState();
      state.talleresUi = createEmptyTalleresUiState();
      state.materiasUi = createEmptyMateriasUiState();
      state.reportesUi = createEmptyReportesUiState();
      state.maintenanceUi = createEmptyMaintenanceUiState();
      state.activeTab = 'planeaciones';
      state.activeAdminModule = 'dashboard';
      resetReportResult();
      clearActionToast();
    }

    function clearLoginInputs() {
      if ($('facilitadorId')) $('facilitadorId').value = '';
      if ($('pinInput')) $('pinInput').value = '';
    }

    function clearSessionScopedState() {
      saveSession(null);
      clearLoadedData();
      clearLoginInputs();
      renderAll();
    }

    function isPlanBuilderExpanded() {
      return !!(state.ui && state.ui.planBuilderExpanded) || state.planEditor.mode === 'edit';
    }

    function togglePlanBuilder(forceValue) {
      const next = typeof forceValue === 'boolean' ? forceValue : !isPlanBuilderExpanded();
      if (next) {
        closeOpenPlan();
        renderPlaneacionesList();
        if (state.planEditor.mode === 'create' && currentViewNeedsCatalogos()) {
          ensurePlaneacionesCatalogosAvailable({ render: true }).catch(() => {});
        }
      }
      if (state.ui) state.ui.planBuilderExpanded = next;
      renderPlanBuilderVisibility();
    }

    function renderPlanBuilderVisibility() {
      const body = $('planBuilderBody');
      const btn = $('togglePlanBuilderBtn');
      const focusBar = $('planBuilderFocusBar');
      const listCard = $('planeacionesListCard');
      if (!body || !btn) return;
      const expanded = isPlanBuilderExpanded();
      const createFocus = expanded && state.planEditor.mode === 'create';
      body.hidden = !expanded;
      if (focusBar) focusBar.hidden = !createFocus;
      if (listCard) listCard.hidden = createFocus;
      btn.textContent = expanded ? 'Ocultar editor' : 'Crear nueva planeación';
      btn.className = expanded
        ? 'btn-ghost plan-builder-launch-btn is-open'
        : 'btn-accent plan-builder-launch-btn is-collapsed';
    }

    function refreshStaticCopy() {
      const heroTitle = document.querySelector('.brand-copy h1');
      const heroParagraph = document.querySelector('.brand-copy p');
      const sessionIntro = document.querySelector('#sessionCard .card-head .subtle');
      if (heroTitle) heroTitle.textContent = 'Libre Aprendiz';
      if (heroParagraph) heroParagraph.textContent = 'Planeacion semanal en una sola vista.';
      if (sessionIntro) sessionIntro.textContent = 'Ingresa con tu facilitador ID y tu PIN.';
    }

    function normalizeActionKeyPart(value) {
      const text = String(value == null ? '' : value).trim();
      if (!text) return '-';
      return text.replace(/[\s:|]+/g, '_').slice(0, 80);
    }

    function buildActionKey(action, parts) {
      return [action].concat((parts || []).map(normalizeActionKeyPart)).join(':');
    }

    function shouldLetAdminPanelBusyButtonGrow(button) {
      return !!(button && button.closest && button.closest([
        '.admin-alumnos-panel-actions',
        '.admin-facilitadores-inline-actions',
        '.admin-facilitadores-assignment-actions',
        '.admin-materias-inline-actions',
        '.admin-materias-variant-actions',
        '.admin-taller-membership-actions'
      ].join(',')));
    }

    function setButtonBusy(button, busy, busyText = 'Procesando...') {
      if (!button) return;
      if (busy) {
        if (button._flashButtonLabelTimer) {
          window.clearTimeout(button._flashButtonLabelTimer);
          button._flashButtonLabelTimer = null;
        }
        if (!button.dataset.originalText) button.dataset.originalText = button.textContent;
        if (!button.dataset.originalWidth) button.dataset.originalWidth = String(button.offsetWidth || 0);
        button.disabled = true;
        button.classList.add('is-busy');
        if (button.classList.contains('btn-open-plan')) {
          if (button.offsetWidth) {
            button.style.minWidth = Math.max(button.offsetWidth, 108) + 'px';
          }
          button.style.width = '';
        } else if (shouldLetAdminPanelBusyButtonGrow(button)) {
          if (button.offsetWidth) {
            button.style.minWidth = button.offsetWidth + 'px';
          }
          button.style.width = '';
        } else if (button.offsetWidth) {
          button.style.width = button.offsetWidth + 'px';
        }
        button.textContent = busyText;
        return;
      }
      button.disabled = false;
      if (button.dataset.originalText) {
        button.textContent = button.dataset.originalText;
        delete button.dataset.originalText;
      }
      button.classList.remove('is-busy');
      button.style.width = '';
      button.style.minWidth = '';
      if (button.dataset.originalWidth) {
        delete button.dataset.originalWidth;
      }
    }

    function flashButtonLabel(button, label, duration = 1100) {
      if (!button) return;
      if (button._flashButtonLabelTimer) {
        window.clearTimeout(button._flashButtonLabelTimer);
        button._flashButtonLabelTimer = null;
      }
      const stableWidth = button.offsetWidth || Number(button.dataset.originalWidth || 0) || 0;
      if (stableWidth) {
        button.style.width = stableWidth + 'px';
      }
      button.textContent = String(label || '').trim() || button.textContent;
      button._flashButtonLabelTimer = window.setTimeout(() => {
        button._flashButtonLabelTimer = null;
        if (button.dataset.originalText) {
          button.textContent = button.dataset.originalText;
        }
        button.style.width = '';
      }, Math.max(300, Number(duration || 0)));
    }

    function captureScrollAnchor(element, targetId) {
      const target = targetId ? $(targetId) : null;
      const anchorElement = target || element;
      if (!anchorElement || typeof anchorElement.getBoundingClientRect !== 'function') return null;
      const rect = anchorElement.getBoundingClientRect();
      return {
        targetId: String(targetId || '').trim(),
        top: rect.top,
        scrollX: Number(window.scrollX || window.pageXOffset || 0),
        scrollY: Number(window.scrollY || window.pageYOffset || 0)
      };
    }

    function captureViewportScrollAnchor() {
      return {
        targetId: '',
        top: 0,
        scrollX: Number(window.scrollX || window.pageXOffset || 0),
        scrollY: Number(window.scrollY || window.pageYOffset || 0)
      };
    }

    function restoreScrollAnchor(anchor) {
      if (!anchor) return;
      window.requestAnimationFrame(() => {
        const target = anchor.targetId ? $(anchor.targetId) : null;
        if (target && typeof target.getBoundingClientRect === 'function') {
          const delta = target.getBoundingClientRect().top - Number(anchor.top || 0);
          if (Math.abs(delta) > 1) window.scrollBy(0, delta);
          return;
        }
        if (Number.isFinite(anchor.scrollY)) {
          window.scrollTo(Number(anchor.scrollX || 0), Number(anchor.scrollY || 0));
        }
      });
    }

    function captureFeedbackAnchor(button) {
      if (!button) return null;
      const rect = button.getBoundingClientRect();
      return {
        button,
        rect: {
          left: rect.left,
          right: rect.right,
          top: rect.top,
          bottom: rect.bottom,
          width: rect.width,
          height: rect.height
        }
      };
    }

    function pushFeedbackAnchor(anchor) {
      feedbackAnchors.push(anchor || null);
    }

    function popFeedbackAnchor() {
      if (feedbackAnchors.length) feedbackAnchors.pop();
    }

    function getActiveFeedbackAnchor() {
      return feedbackAnchors.length ? feedbackAnchors[feedbackAnchors.length - 1] : null;
    }

    function getActionToastLayer() {
      let layer = $('actionToastLayer');
      if (!layer) {
        layer = document.createElement('div');
        layer.id = 'actionToastLayer';
        layer.className = 'action-toast-layer';
        document.body.appendChild(layer);
      }
      return layer;
    }

    function clearActionToast() {
      if (actionToastTimer) {
        clearTimeout(actionToastTimer);
        actionToastTimer = null;
      }
      const layer = $('actionToastLayer');
      if (!layer) return;
      layer.innerHTML = '';
    }

    function showActionToast(anchor, message, kind = 'info') {
      if (!anchor) return false;
      const rect = anchor.button && document.body.contains(anchor.button)
        ? anchor.button.getBoundingClientRect()
        : anchor.rect;
      if (!rect) return false;

      const layer = getActionToastLayer();
      const toast = document.createElement('div');
      const viewportPadding = 16;
      const maxWidth = Math.min(420, Math.max(240, window.innerWidth - (viewportPadding * 2)));
      let left = rect.right + 14;
      let top = rect.top + (rect.height / 2);
      let transform = 'translateY(-50%)';

      if (left + maxWidth > window.innerWidth - viewportPadding) {
        left = Math.max(viewportPadding, Math.min(rect.left, window.innerWidth - maxWidth - viewportPadding));
        top = Math.min(window.innerHeight - viewportPadding - 64, rect.bottom + 12);
        transform = 'none';
      } else {
        top = Math.max(viewportPadding + 24, top);
      }

      clearActionToast();
      toast.className = 'action-toast ' + kind;
      toast.textContent = message;
      toast.style.left = Math.round(left) + 'px';
      toast.style.top = Math.round(top) + 'px';
      toast.style.maxWidth = maxWidth + 'px';
      toast.style.transform = transform;
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      layer.appendChild(toast);

      actionToastTimer = window.setTimeout(clearActionToast, 4200);
      return true;
    }

    function parsePeriodsConfig(raw) {
      return String(raw || '')
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const parts = line.split('|');
          const id = (parts[0] || '').trim();
          const name = (parts[1] || parts[0] || '').trim();
          return id ? { id, name } : null;
        })
        .filter(Boolean);
    }

    function setBanner(message, kind = 'info', options = {}) {
      const anchor = Object.prototype.hasOwnProperty.call(options, 'anchor')
        ? options.anchor
        : (Object.prototype.hasOwnProperty.call(options, 'button')
          ? captureFeedbackAnchor(options.button)
          : getActiveFeedbackAnchor());
      if (anchor && showActionToast(anchor, message, kind)) return;
      clearActionToast();
      const el = $('statusBanner');
      el.className = 'status-banner ' + kind;
      el.textContent = message;
    }

    function loadConfig() {
      state.config.periodConfig = DEFAULT_PERIODS;
    }

    function refreshStaticConfigUi() {
      renderPeriodSelects();
    }

    function getCurrentUserSnapshotKey() {
      const user = state.session && state.session.usuario ? state.session.usuario : null;
      if (!user) return '';
      return [String(user.rol || '').trim(), String(user.facilitador_id || '').trim()].filter(Boolean).join('::');
    }

    function readBootSnapshotStore() {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.bootSnapshot);
        if (!raw) return {};
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === 'object' ? parsed : {};
      } catch (_) {
        return {};
      }
    }

    function writeBootSnapshotStore(store) {
      try {
        localStorage.setItem(STORAGE_KEYS.bootSnapshot, JSON.stringify(store || {}));
      } catch (_) {}
    }

    function isBootSnapshotFresh(snapshot) {
      if (!snapshot || typeof snapshot !== 'object') return false;
      const savedAtMs = Date.parse(String(snapshot.saved_at || ''));
      if (!Number.isFinite(savedAtMs)) return false;
      return (Date.now() - savedAtMs) <= BOOT_SNAPSHOT_MAX_AGE_MS;
    }

    function isTimestampFreshWithin(isoString, maxAgeMs) {
      const value = String(isoString || '').trim();
      if (!value || !Number.isFinite(Number(maxAgeMs)) || Number(maxAgeMs) <= 0) return false;
      const savedAtMs = Date.parse(value);
      if (!Number.isFinite(savedAtMs)) return false;
      return (Date.now() - savedAtMs) <= Number(maxAgeMs);
    }

    function getBootSnapshotByUserKey(userKey) {
      if (!userKey) return null;
      const snapshot = readBootSnapshotStore()[userKey];
      if (!isBootSnapshotFresh(snapshot)) return null;
      return Object.assign({ user_key: userKey }, snapshot);
    }

    function getBootSnapshotForSession(sessionLike = state.session) {
      const user = sessionLike && sessionLike.usuario ? sessionLike.usuario : null;
      if (!user) return null;
      const userKey = [String(user.rol || '').trim(), String(user.facilitador_id || '').trim()].filter(Boolean).join('::');
      return getBootSnapshotByUserKey(userKey);
    }

    function findLatestBootSnapshotByFacilitadorId(facilitadorId) {
      const normalizedId = String(facilitadorId || '').trim();
      if (!normalizedId) return null;
      const suffix = '::' + normalizedId;
      const store = readBootSnapshotStore();
      let latest = null;
      Object.keys(store).forEach((key) => {
        if (!String(key || '').endsWith(suffix)) return;
        const snapshot = getBootSnapshotByUserKey(key);
        if (!snapshot) return;
        const currentTime = Date.parse(String(snapshot.saved_at || '')) || 0;
        const latestTime = latest ? (Date.parse(String(latest.saved_at || '')) || 0) : -1;
        if (!latest || currentTime >= latestTime) latest = snapshot;
      });
      return latest;
    }

    function mergeLoginPreloadCatalogos(snapshot) {
      const catalogos = snapshot && snapshot.catalogos && typeof snapshot.catalogos === 'object'
        ? snapshot.catalogos
        : null;
      if (!catalogos) return false;
      const blocks = LOGIN_PRELOAD_CATALOG_BLOCKS.filter((block) => Array.isArray(catalogos[block]));
      if (!blocks.length) return false;
      mergeCatalogosPayload(catalogos, blocks);
      return true;
    }

    function primeLoginSnapshotCatalogos(facilitadorId) {
      if (state.session && state.session.token) return false;
      const snapshot = findLatestBootSnapshotByFacilitadorId(facilitadorId);
      if (!snapshot) return false;
      const merged = mergeLoginPreloadCatalogos(snapshot);
      if (merged && state.ui) {
        state.ui.loginSnapshotUserKey = snapshot.user_key || '';
        state.ui.loginSnapshotAt = snapshot.saved_at || '';
      }
      return merged;
    }

    function scheduleAfterPaint(task, delay = 0) {
      const runTask = () => Promise.resolve().then(() => (typeof task === 'function' ? task() : null));
      return new Promise((resolve) => {
        const execute = () => runTask().then(resolve, resolve);
        if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
          window.requestAnimationFrame(() => window.setTimeout(execute, delay));
          return;
        }
        window.setTimeout(execute, delay);
      });
    }

    function buildBootSnapshotCatalogos(blocks) {
      const normalized = normalizeCatalogBlocks(blocks);
      return normalized.reduce((acc, block) => {
        acc[block] = Array.isArray(state.catalogos && state.catalogos[block])
          ? state.catalogos[block]
          : [];
        return acc;
      }, {});
    }

    function buildBootSnapshotOpenPlan() {
      const planId = String(state.openPlanId || '').trim();
      if (!planId) return null;
      const plan = getPlanById(planId);
      if (!plan || !plan.detail_loaded) return null;
      try {
        return JSON.parse(JSON.stringify(plan));
      } catch (_) {
        return Object.assign({}, plan);
      }
    }

    // V2: persistir hasta N detalles prefetched (no openPlan) para que reload
    // o F5 no pierda el beneficio del prefetch. Solo planes con detalle fresco
    // y en estados activos. No incluye drafts locales (esos solo del openPlan).
    function buildBootSnapshotPrefetchedPlans() {
      const role = getCurrentRole();
      if (role !== 'facilitador') return { plans: [], savedAtById: {} };
      const openPlanId = String(state.openPlanId || '').trim();
      const planeaciones = Array.isArray(state.planeaciones) ? state.planeaciones : [];
      const result = [];
      const savedAtById = {};
      for (const plan of planeaciones) {
        if (result.length >= PREFETCHED_DETAIL_SNAPSHOT_LIMIT) break;
        if (!plan || !plan.planeacion_id) continue;
        const planId = String(plan.planeacion_id).trim();
        if (!planId || planId === openPlanId) continue;
        const status = String(plan.estado || '').trim();
        if (['cerrada', 'archivada', 'cierre_pendiente'].includes(status)) continue;
        if (isPlaneacionPendingCreation(plan)) continue;
        if (!plan.detail_loaded) continue;
        if (!hasUsableOpenPlanDetail(plan)) continue;
        const savedAt = getOpenPlanDetailSnapshotSavedAt(planId);
        if (!savedAt || !isTimestampFreshWithin(savedAt, OPEN_PLAN_DETAIL_SNAPSHOT_MAX_AGE_MS)) continue;
        let snapshotPlan;
        try {
          snapshotPlan = JSON.parse(JSON.stringify(plan));
        } catch (_) {
          snapshotPlan = Object.assign({}, plan);
        }
        // Drafts locales solo viven en el openPlan; nunca persistir para prefetched.
        delete snapshotPlan._draft_general_observation_text;
        delete snapshotPlan._draft_final_observations_by_key;
        result.push(snapshotPlan);
        savedAtById[planId] = savedAt;
      }
      return { plans: result, savedAtById };
    }

    function getBootSnapshotOpenPlanById(planId, sessionLike = state.session) {
      const normalizedPlanId = String(planId || '').trim();
      if (!normalizedPlanId) return null;
      const snapshot = getBootSnapshotForSession(sessionLike);
      const openPlan = snapshot && snapshot.openPlan && String(snapshot.openPlan.planeacion_id || '').trim() === normalizedPlanId
        ? snapshot.openPlan
        : null;
      if (!openPlan) return null;
      try {
        return JSON.parse(JSON.stringify(openPlan));
      } catch (_) {
        return Object.assign({}, openPlan);
      }
    }

    function buildPlaneacionOpenPreviewRow(plan) {
      if (!plan || !plan.planeacion_id) return null;
      const snapshotOpenPlan = getBootSnapshotOpenPlanById(plan.planeacion_id);
      let preview = Object.assign({}, plan);
      preview = mergePreservedPlaneacionDetail(preview, snapshotOpenPlan);
      preview.alumnos = Array.isArray(preview.alumnos) ? preview.alumnos : [];
      preview.actividades = Array.isArray(preview.actividades) ? preview.actividades : [];
      preview.obs_semana = Array.isArray(preview.obs_semana) ? preview.obs_semana : [];
      preview.obs_alumno_final = Array.isArray(preview.obs_alumno_final) ? preview.obs_alumno_final : [];
      preview.alumnos_count = Number(preview.alumnos_count || preview.alumnos.length || 0);
      preview.actividades_count = Number(preview.actividades_count || preview.actividades.length || 0);
      const keepInlineDetail =
        !!preview.detail_loaded &&
        hasUsableOpenPlanDetail(preview);
      preview.detail_loaded = keepInlineDetail;
      preview.boot_detail_loaded = true;
      if (keepInlineDetail && preview.obs_loaded) {
        preview.obs_loaded = true;
      }
      return preview;
    }

    function buildBootSnapshotOpenPlanDraft() {
      const planId = String(state.openPlanId || '').trim();
      if (!planId || !state.openPlanDraft || state.openPlanDraft.planId !== planId) return null;
      try {
        return JSON.parse(JSON.stringify(state.openPlanDraft));
      } catch (_) {
        return Object.assign({}, state.openPlanDraft);
      }
    }

    function getOpenPlanObsSnapshotSavedAt(planId = state.openPlanId) {
      const normalizedPlanId = String(planId || '').trim();
      if (!normalizedPlanId || !state.ui || !state.ui.planObservacionesSavedAtByPlan) return '';
      return String(state.ui.planObservacionesSavedAtByPlan[normalizedPlanId] || '').trim();
    }

    function getOpenPlanDetailSnapshotSavedAt(planId = state.openPlanId) {
      const normalizedPlanId = String(planId || '').trim();
      if (!normalizedPlanId || !state.ui || !state.ui.planDetailSavedAtByPlan) return '';
      return String(state.ui.planDetailSavedAtByPlan[normalizedPlanId] || '').trim();
    }

    function markAlertasFresh(savedAt = new Date().toISOString()) {
      if (!state.ui) return;
      state.ui.alertasSavedAt = String(savedAt || new Date().toISOString());
    }

    function markNotificacionesFresh(savedAt = new Date().toISOString()) {
      if (!state.ui) return;
      state.ui.notificacionesSavedAt = String(savedAt || new Date().toISOString());
    }

    function markPlaneacionObservacionesFresh(planId, savedAt = new Date().toISOString()) {
      const normalizedPlanId = String(planId || '').trim();
      if (!normalizedPlanId || !state.ui) return;
      if (!state.ui.planObservacionesSavedAtByPlan) state.ui.planObservacionesSavedAtByPlan = {};
      state.ui.planObservacionesSavedAtByPlan[normalizedPlanId] = String(savedAt || new Date().toISOString());
    }

    function markPlaneacionDetailFresh(planId, savedAt = new Date().toISOString()) {
      const normalizedPlanId = String(planId || '').trim();
      if (!normalizedPlanId || !state.ui) return;
      if (!state.ui.planDetailSavedAtByPlan) state.ui.planDetailSavedAtByPlan = {};
      state.ui.planDetailSavedAtByPlan[normalizedPlanId] = String(savedAt || new Date().toISOString());
    }

    function getSnapshotMetaForSession(sessionLike = state.session) {
      const snapshot = getBootSnapshotForSession(sessionLike);
      return snapshot && snapshot.meta && typeof snapshot.meta === 'object' ? snapshot.meta : {};
    }

    function getSnapshotOpenPlanObservaciones(planId, sessionLike = state.session) {
      const normalizedPlanId = String(planId || '').trim();
      if (!normalizedPlanId) return null;
      const snapshot = getBootSnapshotForSession(sessionLike);
      if (!snapshot || !snapshot.openPlan || String(snapshot.openPlan.planeacion_id || '').trim() !== normalizedPlanId) return null;
      if (!snapshot.openPlan.obs_loaded) return null;
      const meta = snapshot.meta && typeof snapshot.meta === 'object' ? snapshot.meta : {};
      const obsSavedAt = String(meta.open_plan_obs_saved_at || snapshot.saved_at || '').trim();
      if (!isTimestampFreshWithin(obsSavedAt, OPEN_PLAN_OBS_SNAPSHOT_MAX_AGE_MS)) return null;
      try {
        return {
          planeacion_id: normalizedPlanId,
          obs_semana: Array.isArray(snapshot.openPlan.obs_semana) ? JSON.parse(JSON.stringify(snapshot.openPlan.obs_semana)) : [],
          obs_alumno_final: Array.isArray(snapshot.openPlan.obs_alumno_final) ? JSON.parse(JSON.stringify(snapshot.openPlan.obs_alumno_final)) : [],
          obs_loaded: true
        };
      } catch (_) {
        return {
          planeacion_id: normalizedPlanId,
          obs_semana: Array.isArray(snapshot.openPlan.obs_semana) ? snapshot.openPlan.obs_semana.slice() : [],
          obs_alumno_final: Array.isArray(snapshot.openPlan.obs_alumno_final) ? snapshot.openPlan.obs_alumno_final.slice() : [],
          obs_loaded: true
        };
      }
    }

    function shouldPreserveSnapshotPlanDetail(planId = state.openPlanId) {
      const savedAt = getOpenPlanDetailSnapshotSavedAt(planId);
      return isTimestampFreshWithin(savedAt, OPEN_PLAN_DETAIL_SNAPSHOT_MAX_AGE_MS);
    }

    function shouldReuseFacilitadorFeedSnapshot(kind) {
      if (canUseAdminShell() || getCurrentRole() !== 'facilitador') return false;
      const meta = getSnapshotMetaForSession();
      if (kind === 'planeaciones') {
        const savedAt = String(meta.planeaciones_saved_at || '').trim();
        return isTimestampFreshWithin(savedAt, FACILITADOR_FEED_SNAPSHOT_MAX_AGE_MS);
      }
      if (kind === 'alertas') {
        if (!Array.isArray(state.alertas)) return false;
        const savedAt = String((state.ui && state.ui.alertasSavedAt) || meta.alertas_saved_at || '').trim();
        return isTimestampFreshWithin(savedAt, FACILITADOR_FEED_SNAPSHOT_MAX_AGE_MS);
      }
      if (kind === 'notificaciones') {
        if (!Array.isArray(state.notificaciones)) return false;
        const savedAt = String((state.ui && state.ui.notificacionesSavedAt) || meta.notificaciones_saved_at || '').trim();
        return isTimestampFreshWithin(savedAt, FACILITADOR_FEED_SNAPSHOT_MAX_AGE_MS);
      }
      return false;
    }

    function persistOpenPlanSnapshotSoon(kind = 'planeacion_draft_local') {
      if (!state.ui) return;
      const timerKey = 'openPlanSnapshotPersist';
      if (state.ui.debounceTimers && state.ui.debounceTimers[timerKey]) {
        window.clearTimeout(state.ui.debounceTimers[timerKey]);
      }
      state.ui.debounceTimers[timerKey] = window.setTimeout(() => {
        persistCurrentBootSnapshot(kind);
        state.ui.debounceTimers[timerKey] = null;
      }, 180);
    }

    function persistCurrentBootSnapshot(kind) {
      const userKey = getCurrentUserSnapshotKey();
      if (!userKey) return;
      const store = readBootSnapshotStore();
      const role = getCurrentRole();
      const payload = {
        kind: kind || role || 'unknown',
        saved_at: new Date().toISOString(),
        user_key: userKey,
        dashboardStats: state.dashboardStats || {}
      };
      if (role === 'facilitador' && !canUseAdminShell()) {
        const snapshotPlaneaciones = Array.isArray(state.planeaciones)
          ? state.planeaciones.filter((plan) => !isPlaneacionPendingCreation(plan))
          : [];
        const snapshotOpenPlanId = String(state.openPlanId || '').trim();
        const snapshotOpenPlanAllowed =
          !!snapshotOpenPlanId &&
          snapshotPlaneaciones.some((plan) => String((plan && plan.planeacion_id) || '').trim() === snapshotOpenPlanId);
        payload.catalogos = buildBootSnapshotCatalogos(getPlaneacionesSurfaceCatalogBlocks());
        payload.planeaciones = snapshotPlaneaciones.slice(0, PLANEACIONES_PAGE_SIZE);
        payload.alertas = Array.isArray(state.alertas) ? state.alertas.slice(0, 20) : [];
        payload.notificaciones = Array.isArray(state.notificaciones) ? state.notificaciones.slice(0, 20) : [];
        payload.openPlanId = snapshotOpenPlanAllowed ? snapshotOpenPlanId : '';
        payload.openPlan = snapshotOpenPlanAllowed ? buildBootSnapshotOpenPlan() : null;
        payload.openPlanDraft = snapshotOpenPlanAllowed ? buildBootSnapshotOpenPlanDraft() : null;
        const prefetchedSummary = buildBootSnapshotPrefetchedPlans();
        payload.prefetchedOpenPlans = prefetchedSummary.plans;
        payload.planeacionesMeta = {
          loaded: !!(state.ui && state.ui.planeacionesLoaded),
          hasMore: !!(state.ui && state.ui.planeacionesHasMore),
          offset: Number(
            state.ui && state.ui.planeacionesOffset || payload.planeaciones.length || 0
          )
        };
        payload.meta = {
          planeaciones_saved_at: payload.saved_at,
          alertas_saved_at: String((state.ui && state.ui.alertasSavedAt) || ''),
          notificaciones_saved_at: String((state.ui && state.ui.notificacionesSavedAt) || ''),
          open_plan_detail_saved_at: getOpenPlanDetailSnapshotSavedAt(payload.openPlanId),
          open_plan_obs_saved_at: getOpenPlanObsSnapshotSavedAt(payload.openPlanId),
          prefetched_plans_saved_at_by_id: prefetchedSummary.savedAtById
        };
      } else if (canUseAdminShell()) {
        payload.alertas = Array.isArray(state.alertas) ? state.alertas.slice(0, 20) : [];
        payload.notificaciones = Array.isArray(state.notificaciones) ? state.notificaciones.slice(0, 20) : [];
      }
      store[userKey] = payload;
      writeBootSnapshotStore(store);
    }

    function restoreBootSnapshotForSession(sessionLike = state.session) {
      const snapshot = getBootSnapshotForSession(sessionLike);
      if (!snapshot || typeof snapshot !== 'object') return false;
      const canReusePlaneacionesSnapshot =
        !(sessionLike && String((sessionLike.rol || getCurrentRole() || '')).trim() === 'facilitador')
        || isTimestampFreshWithin(
          String(
            (snapshot.meta && snapshot.meta.planeaciones_saved_at)
            || snapshot.saved_at
            || ''
          ).trim(),
          FACILITADOR_FEED_SNAPSHOT_MAX_AGE_MS
        );
      if (snapshot.catalogos && typeof snapshot.catalogos === 'object') {
        mergeCatalogosPayload(snapshot.catalogos, Object.keys(snapshot.catalogos));
      }
      if (snapshot.dashboardStats && typeof snapshot.dashboardStats === 'object') {
        state.dashboardStats = Object.assign({}, state.dashboardStats || {}, snapshot.dashboardStats);
      }
      if (canReusePlaneacionesSnapshot && Array.isArray(snapshot.planeaciones)) {
        state.planeaciones = snapshot.planeaciones.filter((plan) => !isPlaneacionPendingCreation(plan));
      }
      if (Array.isArray(snapshot.alertas)) {
        state.alertas = snapshot.alertas;
        markAlertasFresh(snapshot.meta && snapshot.meta.alertas_saved_at ? snapshot.meta.alertas_saved_at : snapshot.saved_at);
      }
      if (Array.isArray(snapshot.notificaciones)) {
        state.notificaciones = snapshot.notificaciones;
        markNotificacionesFresh(snapshot.meta && snapshot.meta.notificaciones_saved_at ? snapshot.meta.notificaciones_saved_at : snapshot.saved_at);
      }
      if (
        snapshot.openPlan &&
        typeof snapshot.openPlan === 'object' &&
        snapshot.openPlan.planeacion_id &&
        !isPlaneacionPendingCreation(snapshot.openPlan)
      ) {
        upsertPlaneacionRow(snapshot.openPlan);
        if (snapshot.openPlan.detail_loaded) {
          markPlaneacionDetailFresh(
            snapshot.openPlan.planeacion_id,
            snapshot.meta && snapshot.meta.open_plan_detail_saved_at ? snapshot.meta.open_plan_detail_saved_at : snapshot.saved_at
          );
        }
        if (snapshot.openPlan.obs_loaded) {
          markPlaneacionObservacionesFresh(
            snapshot.openPlan.planeacion_id,
            snapshot.meta && snapshot.meta.open_plan_obs_saved_at ? snapshot.meta.open_plan_obs_saved_at : snapshot.saved_at
          );
        }
      }
      // V2: restaurar detalle de planes prefetched persistidos. Solo si el row
      // sigue existiendo en la lista, no hay versión más nueva en backend, y el
      // detalle persistido sigue dentro del TTL. No restaura drafts locales.
      if (
        canReusePlaneacionesSnapshot &&
        Array.isArray(snapshot.prefetchedOpenPlans) &&
        snapshot.prefetchedOpenPlans.length
      ) {
        const prefetchedSavedAtMap = (snapshot.meta && typeof snapshot.meta.prefetched_plans_saved_at_by_id === 'object' && snapshot.meta.prefetched_plans_saved_at_by_id)
          ? snapshot.meta.prefetched_plans_saved_at_by_id
          : {};
        snapshot.prefetchedOpenPlans.forEach((prefetchedPlan) => {
          if (!prefetchedPlan || !prefetchedPlan.planeacion_id) return;
          const planId = String(prefetchedPlan.planeacion_id).trim();
          if (!planId) return;
          if (planId === snapshot.openPlanId) return; // ya restaurado como openPlan
          if (isPlaneacionPendingCreation(prefetchedPlan)) return;
          const status = String(prefetchedPlan.estado || '').trim();
          if (['cerrada', 'archivada', 'cierre_pendiente'].includes(status)) return;
          const currentRow = (state.planeaciones || []).find((p) => String((p && p.planeacion_id) || '').trim() === planId);
          if (!currentRow) return;
          // Si el row de la lista trae fecha más nueva, no preservar detalle stale
          const currentUpdatedMs = Date.parse(String(currentRow.fecha_actualizacion || ''));
          const prefetchedUpdatedMs = Date.parse(String(prefetchedPlan.fecha_actualizacion || ''));
          if (Number.isFinite(currentUpdatedMs) && Number.isFinite(prefetchedUpdatedMs) && currentUpdatedMs > prefetchedUpdatedMs) return;
          // Si el bloque de actividades cambió de versión, tampoco preservar
          if (
            currentRow.actividades_version_actual &&
            prefetchedPlan.actividades_version_actual &&
            currentRow.actividades_version_actual !== prefetchedPlan.actividades_version_actual
          ) return;
          const savedAt = String(prefetchedSavedAtMap[planId] || '').trim();
          if (!savedAt || !isTimestampFreshWithin(savedAt, OPEN_PLAN_DETAIL_SNAPSHOT_MAX_AGE_MS)) return;
          upsertPlaneacionRow(prefetchedPlan);
          if (prefetchedPlan.detail_loaded) {
            markPlaneacionDetailFresh(planId, savedAt);
          }
        });
      }
      if (
        canReusePlaneacionesSnapshot &&
        snapshot.openPlanId &&
        Array.isArray(snapshot.planeaciones) &&
        snapshot.planeaciones.some(
          (plan) =>
            plan &&
            !isPlaneacionPendingCreation(plan) &&
            plan.planeacion_id === snapshot.openPlanId
        )
      ) {
        state.openPlanId = snapshot.openPlanId;
      }
      if (
        snapshot.openPlanDraft &&
        typeof snapshot.openPlanDraft === 'object' &&
        snapshot.openPlanDraft.planId &&
        !/^tmppla/i.test(String(snapshot.openPlanDraft.planId || '').trim())
      ) {
        state.openPlanDraft = snapshot.openPlanDraft;
      }
      if (canReusePlaneacionesSnapshot && snapshot.planeacionesMeta && state.ui) {
        state.ui.planeacionesLoaded = !!snapshot.planeacionesMeta.loaded;
        state.ui.planeacionesHasMore = !!snapshot.planeacionesMeta.hasMore;
        state.ui.planeacionesOffset = Number(snapshot.planeacionesMeta.offset || state.planeaciones.length || 0);
      }
      return true;
    }

    function restoreBootSnapshot() {
      return restoreBootSnapshotForSession(state.session);
    }

    function getPlaneacionOutboxOwnerKey(sessionLike = state.session) {
      const usuario = sessionLike && sessionLike.usuario ? sessionLike.usuario : {};
      const role = String((usuario && usuario.rol) || (sessionLike && sessionLike.rol) || '').trim().toLowerCase();
      const facilitadorId = String((usuario && usuario.facilitador_id) || (sessionLike && sessionLike.facilitador_id) || '').trim();
      if (role !== 'facilitador' || !facilitadorId) return '';
      return role + ':' + facilitadorId;
    }

    function isPlaneacionOutboxEnabled(sessionLike = state.session) {
      return !!(sessionLike && sessionLike.token && getPlaneacionOutboxOwnerKey(sessionLike));
    }

    function readPlaneacionOutboxStore() {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.planeacionOutbox);
        if (!raw) return {};
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === 'object' ? parsed : {};
      } catch (_) {
        return {};
      }
    }

    function writePlaneacionOutboxStore(store) {
      try {
        const nextStore = store && typeof store === 'object' ? store : {};
        if (Object.keys(nextStore).length) {
          localStorage.setItem(STORAGE_KEYS.planeacionOutbox, JSON.stringify(nextStore));
        } else {
          localStorage.removeItem(STORAGE_KEYS.planeacionOutbox);
        }
      } catch (_) {}
    }

    function setPlaneacionOutboxItems(items, ownerKey = getPlaneacionOutboxOwnerKey()) {
      const normalizedItems = Array.isArray(items) ? items.filter(Boolean) : [];
      state.planeacionOutbox = normalizedItems;
      if (!ownerKey) return;
      const store = readPlaneacionOutboxStore();
      if (normalizedItems.length) {
        store[ownerKey] = normalizedItems;
      } else {
        delete store[ownerKey];
      }
      writePlaneacionOutboxStore(store);
    }

    function hydratePlaneacionOutboxForSession(sessionLike = state.session) {
      const ownerKey = getPlaneacionOutboxOwnerKey(sessionLike);
      if (!ownerKey) {
        state.planeacionOutbox = [];
        return [];
      }
      const store = readPlaneacionOutboxStore();
      const items = Array.isArray(store[ownerKey]) ? store[ownerKey] : [];
      state.planeacionOutbox = items;
      return items;
    }

    function getPlaneacionOutboxPlanIds(item) {
      if (!item || typeof item !== 'object') return [];
      if (Array.isArray(item.tempPlanIds) && item.tempPlanIds.length) {
        return item.tempPlanIds.map((planId) => String(planId || '').trim()).filter(Boolean);
      }
      return [String(item.planId || '').trim()].filter(Boolean);
    }

    function shouldExposePlaneacionOutboxIssue(item) {
      if (!item || typeof item !== 'object') return false;
      if (item.retryable === false) return true;
      if (String(item.lastErrorCode || '').trim() === 'INVALID_SESSION') return true;
      return Number(item.attempts || 0) >= 3;
    }

    function getPlaneacionOutboxLocalState(item) {
      if (!item || typeof item !== 'object') return '';
      if (String(item.status || '').trim() === 'error' && shouldExposePlaneacionOutboxIssue(item)) return 'sync_error';
      if (String(item.kind || '').trim() === 'editor_create') return 'creating';
      return String(item.localState || 'saving').trim() || 'saving';
    }

    function getPlaneacionOutboxLocalMessage(item) {
      if (!item || typeof item !== 'object') return '';
      const explicitMessage = String(item.localMessage || '').trim();
      const localState = getPlaneacionOutboxLocalState(item);
      if (explicitMessage) return explicitMessage;
      if (localState === 'saving_silent') return '';
      if (String(item.status || '').trim() === 'error') {
        if (!shouldExposePlaneacionOutboxIssue(item)) {
          return '';
        }
        if (item.retryable === false) return 'No se pudo sincronizar. Revisa y vuelve a guardar.';
        if (String(item.lastErrorCode || '').trim() === 'INVALID_SESSION') {
          return 'Pendiente de sincronizar. Vuelve a iniciar sesi\u00f3n para terminar.';
        }
        return 'Guardado local pendiente. Reintentaremos en segundo plano.';
      }
      return '';
    }

    function applyPlaneacionOutboxVisualState(item) {
      if (!item || typeof item !== 'object') return;
      const localState = getPlaneacionOutboxLocalState(item);
      const localMessage = getPlaneacionOutboxLocalMessage(item);
      if (String(item.kind || '').trim() === 'editor_create') {
        upsertPlaneacionesRows((item.optimisticPlans || []).map((plan) => Object.assign({}, plan, {
          _local_save_state: localState,
          _local_save_message: localMessage,
          _local_queue_id: item.id
        })));
        return;
      }
      const optimisticPlan = item.optimisticPlan && typeof item.optimisticPlan === 'object'
        ? Object.assign({}, item.optimisticPlan, {
            _local_save_state: localState,
            _local_save_message: localMessage,
            _local_queue_id: item.id
          })
        : null;
      if (!optimisticPlan || !optimisticPlan.planeacion_id) return;
      upsertPlaneacionRow(optimisticPlan);
      if (state.openPlanId === optimisticPlan.planeacion_id && item.draft && typeof item.draft === 'object') {
        state.openPlanDraft = cloneJsonSafe(item.draft, item.draft) || item.draft;
      }
    }

    function reapplyPlaneacionOutboxState() {
      (state.planeacionOutbox || []).forEach((item) => applyPlaneacionOutboxVisualState(item));
    }

    function clearStalePlaneacionLocalState() {
      const pendingTransactionIds = new Set(
        Object.keys((state.ui && state.ui.pendingPlanSaveTransactions) || {})
          .map((planId) => String(planId || '').trim())
          .filter(Boolean)
      );
      const queuedPlanIds = new Set(
        (state.planeacionOutbox || [])
          .map((item) => String((item && item.planId) || '').trim())
          .filter(Boolean)
      );
      state.planeaciones = (state.planeaciones || []).map((plan) => {
        if (!plan || !plan.planeacion_id) return plan;
        const planId = String(plan.planeacion_id || '').trim();
        const localState = String(plan._local_save_state || '').trim();
        if (!localState) return plan;
        if (pendingTransactionIds.has(planId) || queuedPlanIds.has(planId)) return plan;
        return Object.assign({}, plan, {
          _local_save_state: '',
          _local_save_message: ''
        });
      });
    }

    function clearInvalidSessionFlagsInOutbox(sessionLike = state.session) {
      const ownerKey = getPlaneacionOutboxOwnerKey(sessionLike);
      if (!ownerKey) return;
      const store = readPlaneacionOutboxStore();
      const items = Array.isArray(store[ownerKey]) ? store[ownerKey] : [];
      let changed = false;
      const updated = items.map((item) => {
        if (
          item &&
          String(item.lastErrorCode || '').trim() === 'INVALID_SESSION' &&
          String(item.status || '').trim() === 'error' &&
          item.retryable !== false
        ) {
          changed = true;
          return Object.assign({}, item, {
            status: 'pending',
            lastErrorCode: '',
            lastErrorMessage: '',
            nextAttemptAt: '',
            attempts: 0
          });
        }
        return item;
      });
      if (changed) {
        store[ownerKey] = updated;
        writePlaneacionOutboxStore(store);
      }
    }

    function activatePlaneacionOutboxForSession(sessionLike = state.session) {
      clearInvalidSessionFlagsInOutbox(sessionLike);
      hydratePlaneacionOutboxForSession(sessionLike);
      repairHydratedPlaneacionOutboxSemanaPayloads();
      reapplyPlaneacionOutboxState();
      clearStalePlaneacionLocalState();
      schedulePlaneacionOutboxProcessing(140);
    }

    function loadSession() {
      const raw = localStorage.getItem(STORAGE_KEYS.session);
      if (!raw) return;
      try {
        state.session = JSON.parse(raw);
      } catch (_) {
        state.session = null;
        localStorage.removeItem(STORAGE_KEYS.session);
      }
    }

    function syncAuthMode() {
      const isLoggedIn = !!(state.session && state.session.token && state.session.usuario);
      document.body.classList.toggle('auth-mode', !isLoggedIn);
    }

    function saveSession(session) {
      state.session = session;
      if (session) {
        localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session));
      } else {
        localStorage.removeItem(STORAGE_KEYS.session);
      }
      syncAuthMode();
      renderSession();
    }

    function requireBackendUrl() {
      return FIXED_BACKEND_URL;
    }

    function ensureLoggedIn() {
      if (!state.session || !state.session.token) throw new Error('Primero inicia sesi\u00f3n.');
    }

    function formatApiError(err) {
      if (!err) return 'Error desconocido.';
      const message = String(err.message || err || '').trim();
      if (
        String(err.code || '').trim().toUpperCase() === 'SERVER_ERROR' &&
        message.toLowerCase().includes('no cuentas con el permiso necesario para acceder al documento solicitado')
      ) {
        return 'No se pudo guardar porque el sistema no tiene permiso para escribir en la base de datos. Revisa permisos con admin.';
      }
      return err.code ? err.code + ': ' + err.message : err.message || String(err);
    }

    function getCurrentRole() {
      return state.session && state.session.usuario ? state.session.usuario.rol : '';
    }

    function isTruthyValue(value) {
      if (value === true) return true;
      const normalized = String(value == null ? '' : value).trim().toLowerCase();
      return normalized === 'si' || normalized === 's\u00ed' || normalized === 'true' || normalized === '1' || normalized === 'x' || normalized === 'yes';
    }

    function canUseReportes() {
      const role = getCurrentRole();
      return role === 'directora' || role === 'admin';
    }

    function canUseAdminShell() {
      const role = getCurrentRole();
      return role === 'directora' || role === 'admin';
    }

    function canResetTestEnvironment() {
      return getCurrentRole() === 'admin';
    }

    function ensureCanUseReportes() {
      if (!canUseReportes()) {
        throw new Error('Los reportes solo est\u00e1n disponibles para direcci\u00f3n y admin.');
      }
    }

    function getLocalPeriods() {
      return parsePeriodsConfig(state.config.periodConfig);
    }

    function getAvailablePeriods() {
      const backendPeriods = Array.isArray(state.catalogos.periodos) ? state.catalogos.periodos : [];
      if (backendPeriods.length) {
        return backendPeriods
          .filter((item) => isTruthyValue(item.activo))
          .map((item) => ({
            id: String(item.periodo_id || '').trim(),
            name: String(item.nombre_visible || item.periodo_id || '').trim()
          }))
          .filter((item) => item.id);
      }
      return [];
    }

    function ensureBackendPeriodsReady() {
      if (!Array.isArray(state.catalogos.periodos) || !state.catalogos.periodos.length) {
        throw new Error('El backend no devolvi\u00f3 per\u00edodos activos. Revisa la hoja PERIODOS antes de continuar.');
      }
    }

    async function api(action, payload = {}, options = {}) {
      const backendUrl = requireBackendUrl();
      const body = { action, payload };
      const overrideToken = options && options.tokenOverride
        ? String(options.tokenOverride || '').trim()
        : '';
      if (overrideToken) {
        body.token = overrideToken;
      } else if (state.session && state.session.token) {
        body.token = state.session.token;
      }

      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(body)
      });
      const text = await response.text();
      let json;
      try {
        json = JSON.parse(text);
      } catch (_) {
        throw new Error('El backend respondi\u00f3 algo no JSON: ' + text.slice(0, 180));
      }

      if (!json.ok) {
        const err = new Error(json.error || 'Error del backend');
        err.code = json.code || 'ERROR';
        err.details = json.details || null;
        throw err;
      }
      if (json.meta && json.data && typeof json.data === 'object' && !Array.isArray(json.data)) {
        return Object.assign({}, json.data, { _meta: json.meta });
      }
      return json.data;
    }

    async function pingBackend() {
      const backendUrl = requireBackendUrl();
      const url = backendUrl + (backendUrl.includes('?') ? '&' : '?') + 'action=ping';
      const response = await fetch(url);
      const json = await response.json();
      if (!json.ok) throw new Error(json.error || 'Ping fallido');
      setBanner(
        'Conexi\u00f3n activa con Libre Aprendiz. Backend ' + (json.data && json.data.version || '-') +
        ' | m\u00f3dulo de reportes ' + (json.data && json.data.report_module || '-'),
        'success'
      );
    }

    // Facilitador Backend Warmup V1: ping silencioso al backend para evitar
    // que el primer click del usuario caiga en cold start GAS (~30s). Throttle
    // por localStorage a 10 min m\u00e1ximo. Fire-and-forget, sin banners ni
    // efectos en state. Si falla, queda igual al comportamiento sin warmup.
    function scheduleBackendWarmup() {
      try {
        const STORAGE_KEY = 'la_v8_backend_warmup_at';
        const THROTTLE_MS = 10 * 60 * 1000;
        const nowMs = Date.now();
        const lastRaw = localStorage.getItem(STORAGE_KEY);
        const lastMs = Number(lastRaw || 0);
        if (Number.isFinite(lastMs) && lastMs > 0 && (nowMs - lastMs) < THROTTLE_MS) {
          return;
        }
        const backendUrl = requireBackendUrl();
        const url = backendUrl + (backendUrl.includes('?') ? '&' : '?') + 'action=ping';
        // Marcar timestamp antes del fetch para que reentradas durante el
        // mismo warmup no disparen otro request en paralelo.
        localStorage.setItem(STORAGE_KEY, String(nowMs));
        fetch(url).catch(() => {});
      } catch (_) {
        // localStorage bloqueado o requireBackendUrl falla: nunca arruinar
        // el boot por culpa del warmup. Silencioso.
      }
    }

    function triggerLoginAction(button) {
      const loginButton = button || $('loginBtn');
      // BUG-12: marcar boot en progreso para que renderPlaneacionesList no
      // muestre "Todavía no hay planeaciones..." durante la ventana entre el
      // click de login y la primera carga completa de planeaciones.
      // Re-renderizamos la lista inmediatamente para que el HTML stale del
      // último render (login screen) sea reemplazado por skeleton/loading
      // sin esperar a que api('login') retorne.
      if (state.ui) state.ui.facilitadorBootInProgress = true;
      if (typeof renderPlaneacionesList === 'function') {
        try { renderPlaneacionesList(); } catch (_) {}
      }
      return handleAction('login', login, {
        button: loginButton,
        key: buildActionKey('login', [$('facilitadorId').value]),
        onError: (err) => {
          if (state.ui) state.ui.facilitadorBootInProgress = false;
          return false; // dejar que handleAction muestre el banner de error
        }
      }).finally(() => {
        if (state.ui) state.ui.facilitadorBootInProgress = false;
        if (isPlaneacionesSurfaceVisible()) renderPlaneacionesList();
      });
    }

    async function login() {
      const facilitadorId = $('facilitadorId').value.trim();
      const pin = $('pinInput').value.trim();
      if (!facilitadorId || !pin) throw new Error('Captura facilitador_id y PIN.');
      primeLoginSnapshotCatalogos(facilitadorId);
      const data = await api('login', { facilitador_id: facilitadorId, pin });
      saveSession({ token: data.token, usuario: data.usuario });
      setBanner('Cada semana abre una nueva oportunidad para acompañar, observar y hacer crecer el aprendizaje.', 'info');
      if (canUseAdminShell()) {
        ensureAdminShellMarkupLoaded();
        bindWindowActionGroup('admin');
        bindAdminUiEventsOnce();
      }
      const restoredSnapshot = restoreBootSnapshotForSession({ usuario: data.usuario });
      activatePlaneacionOutboxForSession(state.session);
      if (!canUseAdminShell() && String(state.activeTab || '').trim() === 'planeaciones') {
        setPlaneacionesRestoreLock(true);
      }
      clearLoginInputs();
      renderBootSurface();
      if (shouldDeferFacilitadorRestoreRefresh(restoredSnapshot, { usuario: data.usuario })) {
        scheduleDeferredRestoreRefresh();
        return;
      }
      setRestoreSnapshotSyncing(false);
      await refreshAll({ fastFacilitadorBoot: true });
    }

    async function logout() {
      if (!state.session || !state.session.token) {
        clearLoadedData();
        clearLoginInputs();
        renderAll();
        saveSession(null);
        setBanner('No hab\u00eda una sesi\u00f3n activa.', 'info');
        return;
      }
      const previousToken = state.session.token;
      saveSession(null);
      clearLoadedData();
      clearLoginInputs();
      renderAll();
      setBanner('Sesi\u00f3n cerrada.', 'success');
      api('logout', {}, { tokenOverride: previousToken }).catch(() => {});
    }

    async function refreshCatalogos(options = {}) {
      ensureLoggedIn();
      const blocks = normalizeCatalogBlocks(options.blocks || getCurrentCatalogBlocks());
      if (!blocks.length) return state.catalogos;
      const data = await api('getCatalogos', { blocks });
      mergeCatalogosPayload(data, blocks);
      if (blocks.some((block) => getPlaneacionesSurfaceCatalogBlocks().includes(block))) {
        persistCurrentBootSnapshot('catalogos');
      }
      return state.catalogos;
    }

    function buildPlaneacionesPayload(options = {}) {
      const payload = {
        limit: Number(options.limit || PLANEACIONES_PAGE_SIZE),
        offset: Math.max(0, Number(options.offset || 0))
      };
      const semanaFilter = $('filterSemana').value;
      const estadoFilter = $('filterEstado').value;
      const grupoFilter = $('filterGrupo').value;
      const facilitadorFilter = $('filterFacilitador').value;
      const alumnoFilter = $('filterAlumnoId').value;
      if (semanaFilter) payload.semana_id = semanaFilter;
      if (estadoFilter) payload.estado = estadoFilter;
      if (grupoFilter) payload.grupo_id = grupoFilter;
      if (facilitadorFilter) payload.facilitador_id = facilitadorFilter;
      if (alumnoFilter) payload.alumno_id = alumnoFilter;
      return payload;
    }

    function getActivePlaneacionFilters() {
      return {
        semana_id: String(($('filterSemana') && $('filterSemana').value) || '').trim(),
        estado: String(($('filterEstado') && $('filterEstado').value) || '').trim(),
        grupo_id: String(($('filterGrupo') && $('filterGrupo').value) || '').trim(),
        facilitador_id: String(($('filterFacilitador') && $('filterFacilitador').value) || '').trim(),
        alumno_id: String(($('filterAlumnoId') && $('filterAlumnoId').value) || '').trim()
      };
    }

    function applyLocalPlaneacionFilters(baseList, filters) {
      return (Array.isArray(baseList) ? baseList : []).filter((plan) => {
        if (!plan) return false;
        if (filters.semana_id && String(plan.semana_id || '').trim() !== filters.semana_id) return false;
        if (filters.estado && String(plan.estado || '').trim() !== filters.estado) return false;
        if (filters.grupo_id && String(plan.grupo_id || '').trim() !== filters.grupo_id) return false;
        if (filters.facilitador_id && String(plan.facilitador_id || '').trim() !== filters.facilitador_id) return false;
        return true;
      });
    }

    function canSkipBackendForPlaneacionFilter(filters, append) {
      if (append) return false;
      if (!state.ui) return false;
      if (!state.ui.planeacionesLoaded) return false;
      const role = String(getCurrentRole() || '').trim().toLowerCase();
      if (role !== 'facilitador') return false; // admin tiene queries más complejas
      if (filters.alumno_id) return false; // alumno requiere backend
      const baseList = Array.isArray(state.ui.planeacionesUnfilteredBase)
        ? state.ui.planeacionesUnfilteredBase
        : null;
      if (!baseList || !baseList.length) return false;
      // Si la base list fue cargada con has_more, no podemos confiar en cobertura
      return state.ui.planeacionesUnfilteredHasMore === false;
    }

    function updatePlaneacionesUnfilteredBaseFromCurrent(hasMore) {
      if (!state.ui) return;
      const role = String(getCurrentRole() || '').trim().toLowerCase();
      if (role !== 'facilitador' || canUseAdminShell()) return;
      if (hasActivePlaneacionesFilters()) return;
      state.ui.planeacionesUnfilteredBase = (Array.isArray(state.planeaciones) ? state.planeaciones : []).slice();
      state.ui.planeacionesUnfilteredHasMore = !!hasMore;
    }

    async function refreshPlaneaciones(options = {}) {
      ensureLoggedIn();
      const append = !!options.append;
      const nextOffset = append && state.ui ? Number(state.ui.planeacionesOffset || 0) : 0;
      const activeFilters = getActivePlaneacionFilters();

      // A2: Filtro híbrido — si tenemos base list completa sin filtros, filtrar local
      // y saltarse el round-trip al backend.
      if (canSkipBackendForPlaneacionFilter(activeFilters, append)) {
        const filtered = applyLocalPlaneacionFilters(state.ui.planeacionesUnfilteredBase, activeFilters);
        state.planeaciones = preserveOpenPlanDetailOnRowsReplace(filtered);
        if (state.ui) {
          state.ui.planeacionesLoaded = true;
          state.ui.planeacionesOffset = filtered.length;
          state.ui.planeacionesHasMore = false;
          state.ui.planeacionesLoading = false;
          state.ui.planeacionesLoadingMore = false;
        }
        if (isPlaneacionesSurfaceVisible()) renderPlaneacionesList();
        return;
      }

      if (state.ui) {
        state.ui.planeacionesLoading = !append;
        state.ui.planeacionesLoadingMore = append;
      }
      if (isPlaneacionesSurfaceVisible()) renderPlaneacionesList();
      try {
        const data = await api('getPlaneaciones', Object.assign({}, buildPlaneacionesPayload({
          limit: options.limit || PLANEACIONES_PAGE_SIZE,
          offset: nextOffset
        }), {
          include_detail: false
        }));
        const nextRows = Array.isArray(data.rows) ? data.rows : [];
        if (append) {
          appendPlaneacionesRows(nextRows);
        } else {
          state.planeaciones = preserveOpenPlanDetailOnRowsReplace(nextRows);
        }
        if (state.ui) {
          state.ui.planeacionesLoaded = true;
          state.ui.planeacionesOffset = append ? (nextOffset + nextRows.length) : nextRows.length;
          state.ui.planeacionesHasMore = !!data.has_more;
          // A2: si esta carga vino sin filtros, guardarla como base list para usos posteriores
          const noFiltersActive = !activeFilters.semana_id && !activeFilters.estado &&
            !activeFilters.grupo_id && !activeFilters.facilitador_id && !activeFilters.alumno_id;
          if (!append && noFiltersActive) {
            updatePlaneacionesUnfilteredBaseFromCurrent(!!data.has_more);
          }
        }
        if (!append) persistCurrentBootSnapshot('planeaciones');
        if (!append && state.openPlanId && (canUseAdminShell() ? state.activeAdminModule === 'planeaciones' : state.activeTab === 'planeaciones')) {
          const openPlan = getPlanById(state.openPlanId);
          if (!(openPlan && openPlan.detail_loaded && shouldPreserveSnapshotPlanDetail(state.openPlanId))) {
            await ensurePlaneacionDetailLoaded(state.openPlanId, { silent: true });
          }
        }
      } finally {
        if (state.ui) {
          state.ui.planeacionesLoading = false;
          state.ui.planeacionesLoadingMore = false;
        }
      }
    }

    async function refreshAlertas(options = {}) {
      ensureLoggedIn();
      if (!options.force && shouldReuseFacilitadorFeedSnapshot('alertas')) {
        return { rows: Array.isArray(state.alertas) ? state.alertas : [], reusedSnapshot: true };
      }
      const data = await api('getAlertas', { limit: 20 });
      state.alertas = Array.isArray(data.rows) ? data.rows : [];
      markAlertasFresh();
      persistCurrentBootSnapshot('alertas');
      return data;
    }

    async function refreshNotificaciones(options = {}) {
      ensureLoggedIn();
      if (!options.force && shouldReuseFacilitadorFeedSnapshot('notificaciones')) {
        return { rows: Array.isArray(state.notificaciones) ? state.notificaciones : [], reusedSnapshot: true };
      }
      const defaultLimit = canUseAdminShell() ? 100 : 20;
      const limit = Math.max(1, Number(options.limit) || defaultLimit);
      const data = await api('getNotificaciones', { limit });
      state.notificaciones = Array.isArray(data.rows) ? data.rows : [];
      markNotificacionesFresh();
      persistCurrentBootSnapshot('notificaciones');
      return data;
    }

    function shouldUseFastFacilitadorPlaneacionesBoot(options = {}) {
      return !!(
        options &&
        options.fastFacilitadorBoot &&
        getCurrentRole() === 'facilitador' &&
        !canUseAdminShell() &&
        String(state.activeTab || '').trim() === 'planeaciones'
      );
    }

    function shouldUseFastAdminDashboardBoot(options = {}) {
      return !!(
        options &&
        options.fastFacilitadorBoot &&
        canUseAdminShell() &&
        String(state.activeAdminModule || '').trim() === 'dashboard'
      );
    }

    function shouldDeferFacilitadorRestoreRefresh(restoredSnapshot, sessionLike = state.session) {
      const role = sessionLike && sessionLike.usuario ? String(sessionLike.usuario.rol || '').trim() : getCurrentRole();
      if (!restoredSnapshot || role !== 'facilitador' || canUseAdminShell()) return false;
      if (String(state.activeTab || '').trim() !== 'planeaciones') return false;
      return shouldReuseFacilitadorFeedSnapshot('planeaciones');
    }

    function setRestoreSnapshotSyncing(isActive) {
      if (!state.ui) return;
      const nextValue = !!isActive;
      if (state.ui.restoreSnapshotSyncing === nextValue) return;
      const wasSyncing = state.ui.restoreSnapshotSyncing;
      state.ui.restoreSnapshotSyncing = nextValue;
      // BUG-M4: al terminar sync (true → false), mostrar pill "Actualizado"
      // por 2s y luego ocultar. Evita que "Restaurado · Sync" quede colgado
      // permanentemente en el header tras un restore exitoso.
      if (wasSyncing && !nextValue) {
        state.ui.restoreSnapshotSyncJustFinished = true;
        if (state.ui.restoreSnapshotSyncFinishedTimeout) {
          clearTimeout(state.ui.restoreSnapshotSyncFinishedTimeout);
        }
        state.ui.restoreSnapshotSyncFinishedTimeout = setTimeout(() => {
          if (!state.ui) return;
          state.ui.restoreSnapshotSyncJustFinished = false;
          state.ui.restoreSnapshotSyncFinishedTimeout = null;
          renderSession();
        }, 2000);
      } else if (nextValue) {
        // Si vuelve a entrar a sync, cancelar el timeout de "Actualizado".
        if (state.ui.restoreSnapshotSyncFinishedTimeout) {
          clearTimeout(state.ui.restoreSnapshotSyncFinishedTimeout);
          state.ui.restoreSnapshotSyncFinishedTimeout = null;
        }
        state.ui.restoreSnapshotSyncJustFinished = false;
      }
      renderSession();
    }

    function scheduleDeferredRestoreRefresh() {
      setRestoreSnapshotSyncing(true);
      const promise = scheduleAfterPaint(() => refreshAll({ fastFacilitadorBoot: true }), 40)
        .catch((error) => {
          setPlaneacionesRestoreLock(false);
          setBanner(formatApiError(error), 'error');
        });
      if (state.ui) state.ui.fastPlaneacionesBootPromise = promise;
      promise.finally(() => {
        if (state.ui && state.ui.fastPlaneacionesBootPromise === promise) {
          state.ui.fastPlaneacionesBootPromise = null;
        }
        setRestoreSnapshotSyncing(false);
      });
      return promise;
    }

    async function ensurePlaneacionesCatalogosAvailable(options = {}) {
      const scope = String(options && options.scope || 'editor').trim() || 'editor';
      const blocks = getMissingCatalogBlocks(getCatalogBlocksForModuleWithScope('planeaciones', { scope }));
      if (!blocks.length) return state.catalogos;
      if (state.ui && state.ui.planeacionesCatalogosPromise) {
        const pendingBlocks = Array.isArray(state.ui.planeacionesCatalogosPendingBlocks)
          ? state.ui.planeacionesCatalogosPendingBlocks
          : [];
        if (blocks.every((block) => pendingBlocks.includes(block))) {
          return state.ui.planeacionesCatalogosPromise;
        }
        return state.ui.planeacionesCatalogosPromise.then(() => ensurePlaneacionesCatalogosAvailable(options));
      }
      if (state.ui) state.ui.planeacionesCatalogosLoading = true;
      if (state.ui) state.ui.planeacionesCatalogosPendingBlocks = [...blocks];
      if (options.render !== false) renderPlanEditor();
      const promise = refreshCatalogos({ blocks })
        .then(() => {
          if (state.ui) state.ui.planeacionesCatalogosLoading = false;
          if (options.render !== false) {
            renderBaseSelects({ planeaciones: true });
            renderPlanBuilderVisibility();
            if (isPlaneacionesSurfaceVisible()) {
              renderPlaneacionesSurface({
                includeStats: false,
                includePlaneaciones: true,
                includeAlertas: false
              });
            }
          } else if (isPlanBuilderExpanded() || isPlaneacionesSurfaceVisible()) {
            renderBaseSelects({ planeaciones: true });
            renderPlanBuilderVisibility();
          }
          return state.catalogos;
        })
        .finally(() => {
          if (state.ui) {
            state.ui.planeacionesCatalogosPromise = null;
            state.ui.planeacionesCatalogosLoading = false;
            state.ui.planeacionesCatalogosPendingBlocks = [];
          }
        });
      if (state.ui) state.ui.planeacionesCatalogosPromise = promise;
      return promise;
    }

    function getAdminPlaneacionesFilterCatalogBlocks() {
      return ['grupos', 'facilitadores', 'alumnos'];
    }

    function getAdminPlaneacionesFilterMissingBlocks() {
      const required = getAdminPlaneacionesFilterCatalogBlocks();
      const missing = new Set(getMissingCatalogBlocks(required));
      required.forEach((block) => {
        if (!Array.isArray(state.catalogos && state.catalogos[block]) || !state.catalogos[block].length) {
          missing.add(block);
        }
      });
      return Array.from(missing);
    }

    function ensureAdminPlaneacionesFilterCatalogosAvailable(options = {}) {
      if (!canUseAdminShell()) return Promise.resolve(state.catalogos);
      if (String(state.activeAdminModule || '').trim() !== 'planeaciones') return Promise.resolve(state.catalogos);
      const blocks = getAdminPlaneacionesFilterMissingBlocks();
      if (!blocks.length) return Promise.resolve(state.catalogos);
      if (state.ui && state.ui.adminPlaneacionesFilterCatalogosPromise) {
        return state.ui.adminPlaneacionesFilterCatalogosPromise;
      }
      const promise = refreshCatalogos({ blocks })
        .then(() => {
          if (options.render !== false && String(state.activeAdminModule || '').trim() === 'planeaciones') {
            renderBaseSelects({ planeaciones: true });
            renderPlaneacionesSurface({
              includeStats: false,
              includePlaneaciones: false,
              includeAlertas: false
            });
          }
          return state.catalogos;
        })
        .finally(() => {
          if (state.ui) state.ui.adminPlaneacionesFilterCatalogosPromise = null;
        });
      if (state.ui) state.ui.adminPlaneacionesFilterCatalogosPromise = promise;
      return promise;
    }

    // Precarga silenciosa de catalogos del editor (alumnos, submaterias, talleres,
    // alumno_talleres) despues del primer paint del facilitador. Objetivo: que
    // "Crear nueva planeacion" abra con campos ya listos sin mostrar el pill
    // "Preparando opciones...". No bloquea boot/login ni genera banners.
    function scheduleFacilitadorEditorCatalogosWarmup(reason) {
      if (getCurrentRole() !== 'facilitador') return;
      if (canUseAdminShell()) return;
      if (!currentViewNeedsCatalogos()) return;
      if (state.ui && state.ui.planeacionesCatalogosPromise) return;
      if (state.ui && state.ui.editorCatalogosWarmupScheduled) return;
      if (state.ui) state.ui.editorCatalogosWarmupScheduled = true;
      scheduleAfterPaint(function () {
        window.setTimeout(function () {
          if (getCurrentRole() !== 'facilitador') return;
          if (canUseAdminShell()) return;
          if (!currentViewNeedsCatalogos()) return;
          ensurePlaneacionesCatalogosAvailable({ render: false, scope: 'editor' })
            .catch(function () {})
            .finally(function () {
              if (state.ui) state.ui.editorCatalogosWarmupScheduled = false;
            });
        }, 600);
        return null;
      });
    }

    async function ensureTallerMembershipCatalogosAvailable(options = {}) {
      const blocks = getMissingCatalogBlocks(['alumnos', 'grupos']);
      if (!blocks.length) return state.catalogos;
      if (state.ui && state.ui.tallerMembershipCatalogosPromise) {
        return state.ui.tallerMembershipCatalogosPromise;
      }
      const promise = refreshCatalogos({ blocks })
        .then(() => {
          if (options.render !== false && state.activeAdminModule === 'talleres') {
            renderAdminTalleresModule();
          }
          return state.catalogos;
        })
        .finally(() => {
          if (state.ui) state.ui.tallerMembershipCatalogosPromise = null;
        });
      if (state.ui) state.ui.tallerMembershipCatalogosPromise = promise;
      return promise;
    }

    async function refreshFacilitadorPlaneacionesFastBoot(options = {}) {
      ensureLoggedIn();
      // === Pre-cálculo de flags ===
      const surfaceCatalogBlocks = getPlaneacionesSurfaceCatalogBlocks();
      const missingSurfaceCatalogBlocks = getMissingCatalogBlocks(surfaceCatalogBlocks);
      const shouldRequestSurfaceCatalogs = missingSurfaceCatalogBlocks.length > 0;
      const requestedOpenPlanId = String(state.openPlanId || '').trim();
      const canReuseSnapshotOpenPlanDetail = requestedOpenPlanId && shouldPreserveSnapshotPlanDetail(requestedOpenPlanId);
      const canReusePlaneacionesSnapshot =
        shouldReuseFacilitadorFeedSnapshot('planeaciones') &&
        !hasActivePlaneacionesFilters() &&
        Array.isArray(state.planeaciones) &&
        (!!state.planeaciones.length || !!(state.ui && state.ui.planeacionesLoaded));
      const canReuseStatsSnapshot =
        canReusePlaneacionesSnapshot &&
        state.dashboardStats &&
        typeof state.dashboardStats === 'object' &&
        Object.keys(state.dashboardStats).length > 0;
      const shouldRequestPlaneaciones = !canReusePlaneacionesSnapshot;
      const shouldReuseAlertas = shouldReuseFacilitadorFeedSnapshot('alertas');
      const shouldReuseNotificaciones = shouldReuseFacilitadorFeedSnapshot('notificaciones');

      // === FASE A: request crítico mínimo (solo planeaciones, sin catalogos/
      // alertas/notif/stats/openPlan/detail). Meta: lista visible lo antes posible.
      // Todo lo secundario va en Fase B background. ===
      let bootData = null;
      if (shouldRequestPlaneaciones) {
        bootData = await api('getFacilitadorBoot', Object.assign({}, buildPlaneacionesPayload(), {
          include_planeaciones: true,
          include_catalogos: false,
          include_alertas: false,
          include_notificaciones: false,
          include_stats: false,
          open_plan_id: '',
          include_detail: false
        }));
        const bootRows = Array.isArray(bootData && bootData.planeaciones && bootData.planeaciones.rows)
          ? bootData.planeaciones.rows
          : [];
        const snapshotOpenPlan = canReuseSnapshotOpenPlanDetail
          ? (getPlanById(requestedOpenPlanId) || getBootSnapshotOpenPlanById(requestedOpenPlanId))
          : null;
        state.planeaciones = preserveOpenPlanDetailOnRowsReplace(bootRows, snapshotOpenPlan, requestedOpenPlanId);
      }

      // Stats: si no hay del snapshot, derivar local de state.planeaciones para
      // que los cards de estadísticas no muestren ceros. Stats exactos pueden
      // refrescarse en Fase B si se considera necesario (V1 deja local).
      if (!canReuseStatsSnapshot) {
        const planList = Array.isArray(state.planeaciones) ? state.planeaciones : [];
        const closedStatuses = ['cerrada', 'archivada'];
        const localStats = {
          planeaciones_visibles: planList.length,
          planeaciones_abiertas: planList.filter((p) => p && !closedStatuses.includes(String(p.estado || '').trim())).length,
          planeaciones_cerradas: planList.filter((p) => p && closedStatuses.includes(String(p.estado || '').trim())).length
        };
        state.dashboardStats = Object.assign({}, state.dashboardStats || {}, localStats);
      }

      if (state.ui) {
        state.ui.planeacionesLoaded = shouldRequestPlaneaciones
          ? true
          : !!(state.ui.planeacionesLoaded || canReusePlaneacionesSnapshot);
        state.ui.planeacionesLoading = false;
        state.ui.planeacionesLoadingMore = false;
        if (shouldRequestPlaneaciones) {
          state.ui.planeacionesOffset = state.planeaciones.length;
          state.ui.planeacionesHasMore = !!(bootData && bootData.planeaciones && bootData.planeaciones.has_more);
        }
        if (!hasActivePlaneacionesFilters()) {
          updatePlaneacionesUnfilteredBaseFromCurrent(!!state.ui.planeacionesHasMore);
        }
      }
      persistCurrentBootSnapshot('facilitador_boot_listfirst');

      // === Render rápido: lista visible al usuario ===
      renderSession();
      renderStats();
      renderPlaneacionesSurface({
        includeStats: false,
        includePlaneaciones: true,
        includeAlertas: false
      });
      renderInstitutionalNotices();
      syncRoleUi();

      // === FASE B: hidratación en background sin bloquear lista ===
      const deferredPromise = scheduleAfterPaint(async () => {
        // 1. Catálogos de superficie (necesarios para selects/editor de planeación)
        if (shouldRequestSurfaceCatalogs) {
          try {
            await refreshCatalogos({ blocks: missingSurfaceCatalogBlocks });
          } catch (_) {}
        }
        renderBaseSelects({ planeaciones: true });
        renderPlanBuilderVisibility();

        // 2. Alertas (silencioso, sin banner)
        if (!shouldReuseAlertas) {
          try {
            await refreshAlertas();
            renderPlaneacionesSurface({ includeStats: false, includePlaneaciones: false, includeAlertas: true });
          } catch (_) {}
        }

        // 3. Notificaciones (silencioso)
        if (!shouldReuseNotificaciones) {
          try {
            await refreshNotificaciones();
            persistCurrentBootSnapshot('notificaciones');
            renderInstitutionalNotices();
          } catch (_) {}
        }

        // 4. Si la lista vino del snapshot (no la pedimos al backend), refresh
        // suave en background para sincronizar cambios remotos sin parpadeo
        // perceptible.
        if (!shouldRequestPlaneaciones) {
          try {
            await refreshPlaneaciones();
            renderPlaneacionesSurface({
              includeStats: true,
              includePlaneaciones: true,
              includeAlertas: false
            });
          } catch (_) {}
        }

        // 5. Detalle del openPlan restaurado (si corresponde)
        if (state.openPlanId && Array.isArray(state.planeaciones) && state.planeaciones.some((plan) => plan && plan.planeacion_id === state.openPlanId)) {
          await scheduleAfterPaint(async () => {
            try {
              const currentOpenPlan = getPlanById(state.openPlanId);
              const canReuseFullSnapshot = !!(currentOpenPlan && currentOpenPlan.detail_loaded && shouldPreserveSnapshotPlanDetail(state.openPlanId));
              if (!canReuseFullSnapshot) {
                await ensurePlaneacionDetailLoaded(state.openPlanId, { silent: true });
              }
              persistCurrentBootSnapshot('facilitador_boot_detail');
              renderPlaneacionesList();
              scheduleAfterPaint(() => {
                if (state.openPlanId !== requestedOpenPlanId) return null;
                return ensurePlaneacionObservacionesLoaded(state.openPlanId, { silent: true })
                  .then(() => {
                    if (state.openPlanId !== requestedOpenPlanId) return;
                    renderPlaneacionesList();
                  })
                  .catch(() => null);
              }, 120);
            } catch (_) {}
          }, 120);
        }

        // 6. Prefetch de detalles para las primeras planeaciones visibles
        try {
          scheduleVisiblePlaneacionDetailPrefetch();
        } catch (_) {}
      }, 80);

      if (state.ui) state.ui.fastPlaneacionesBootPromise = deferredPromise;
      deferredPromise.finally(() => {
        if (state.ui) state.ui.fastPlaneacionesBootPromise = null;
      });
      setPlaneacionesRestoreLock(false);
      scheduleFacilitadorEditorCatalogosWarmup('boot');
    }

    async function refreshAdminDashboardFastBoot(options = {}) {
      ensureLoggedIn();
      const dashboard = await api('getDashboard', Object.assign({}, buildPlaneacionesPayload(), {
        alert_limit: 20,
        notification_limit: 20,
        include_catalogos: false,
        include_planeaciones: false,
        include_notificaciones: false,
        include_detail: false
      }));
      state.dashboardStats = dashboard && dashboard.stats ? dashboard.stats : {};
      state.alertas = Array.isArray(dashboard && dashboard.alertas && dashboard.alertas.rows)
        ? dashboard.alertas.rows
        : [];
      state.notificaciones = [];
      renderSession();
      renderStats();
      renderAdminShell();
      renderAlertas();
      renderInstitutionalNotices();
      syncRoleUi();
      scheduleAdminCatalogPrefetch();
      scheduleAdminNotificationsPrefetch();

      const deferredPromise = Promise.resolve();

      if (state.ui) state.ui.fastAdminBootPromise = deferredPromise;
      deferredPromise.finally(() => {
        if (state.ui) state.ui.fastAdminBootPromise = null;
      });
    }

    async function refreshAll(options = {}) {
      ensureLoggedIn();
      const attemptedFastFacilitadorBoot = shouldUseFastFacilitadorPlaneacionesBoot(options);
      const attemptedFastAdminBoot = shouldUseFastAdminDashboardBoot(options);
      if (shouldUseFastFacilitadorPlaneacionesBoot(options)) {
        try {
          await refreshFacilitadorPlaneacionesFastBoot(options);
          return;
        } catch (_) {
          setPlaneacionesRestoreLock(false);
        }
      }
      if (shouldUseFastAdminDashboardBoot(options)) {
        try {
          await refreshAdminDashboardFastBoot(options);
          return;
        } catch (_) {}
      }
      const silent = !!(options && options.silent);
      const adminNeedsAlertRows = canUseAdminShell() && ['dashboard', 'planeaciones'].includes(String(state.activeAdminModule || '').trim());
      const adminNeedsNotificationRows = canUseAdminShell() && String(state.activeAdminModule || '').trim() === 'notificaciones';
      const shouldIncludeCatalogos = currentViewNeedsCatalogos();
      const requestedCatalogBlocks = shouldIncludeCatalogos ? getCurrentCatalogBlocks() : [];
      const shouldIncludePlaneaciones = currentViewNeedsPlaneaciones();
      try {
        const notificationLimit = canUseAdminShell() ? (adminNeedsNotificationRows ? 100 : 20) : 120;
        const dashboardCatalogBlocks = shouldIncludeCatalogos
          ? (silent ? getMissingCatalogBlocks(requestedCatalogBlocks) : requestedCatalogBlocks)
          : [];
        const reuseCatalogos = shouldIncludeCatalogos && silent && dashboardCatalogBlocks.length === 0;
        const dashboard = await api('getDashboard', Object.assign({}, buildPlaneacionesPayload(), {
          alert_limit: 20,
          notification_limit: notificationLimit,
          include_catalogos: shouldIncludeCatalogos && !reuseCatalogos,
          catalog_blocks: dashboardCatalogBlocks,
          include_planeaciones: shouldIncludePlaneaciones,
          include_alertas: !canUseAdminShell() || adminNeedsAlertRows,
          include_notificaciones: !canUseAdminShell() || adminNeedsNotificationRows,
          include_detail: false
        }));
        state.dashboardStats = dashboard && dashboard.stats ? dashboard.stats : {};
        if (dashboard && dashboard.catalogos && Object.keys(dashboard.catalogos).length) {
          mergeCatalogosPayload(dashboard.catalogos, dashboardCatalogBlocks);
        } else if (!hasCatalogosLoaded()) {
          state.catalogos = createEmptyCatalogos();
          state.catalogosMeta = createEmptyCatalogosMeta();
        }
        if (shouldIncludePlaneaciones) {
          state.planeaciones = Array.isArray(dashboard && dashboard.planeaciones && dashboard.planeaciones.rows)
            ? dashboard.planeaciones.rows
            : [];
          if (state.ui) state.ui.planeacionesLoaded = true;
        }
        if (state.openPlanId && shouldIncludePlaneaciones && (canUseAdminShell() ? state.activeAdminModule === 'planeaciones' : state.activeTab === 'planeaciones')) {
          await ensurePlaneacionDetailLoaded(state.openPlanId, { silent: true });
        }
        state.alertas = Array.isArray(dashboard && dashboard.alertas && dashboard.alertas.rows)
          ? dashboard.alertas.rows
          : ((!canUseAdminShell() || adminNeedsAlertRows) ? [] : state.alertas);
        state.notificaciones = Array.isArray(dashboard && dashboard.notificaciones && dashboard.notificaciones.rows)
          ? dashboard.notificaciones.rows
          : ((!canUseAdminShell() || adminNeedsNotificationRows) ? [] : state.notificaciones);
      } catch (_) {
        const tasks = [];
        if (shouldIncludeCatalogos) tasks.push(refreshCatalogos());
        if (shouldIncludePlaneaciones) tasks.push(refreshPlaneaciones());
        if (!canUseAdminShell() || adminNeedsAlertRows) tasks.push(refreshAlertas());
        if (!canUseAdminShell() || adminNeedsNotificationRows) tasks.push(refreshNotificaciones());
        await Promise.all(tasks);
      }
      if (attemptedFastFacilitadorBoot || attemptedFastAdminBoot) {
        renderBootSurface();
      } else {
        renderAll();
      }
      if (requestedCatalogBlocks.includes('periodos') && (!Array.isArray(state.catalogos.periodos) || !state.catalogos.periodos.length)) {
        setBanner('Faltan per\u00edodos activos en el backend. Revisa la hoja PERIODOS.', 'error');
        return;
      }
    }

    function isPlaneacionesSurfaceVisible() {
      return canUseAdminShell() ? state.activeAdminModule === 'planeaciones' : state.activeTab === 'planeaciones';
    }

    function isAlertasSurfaceVisible() {
      return !canUseAdminShell() || state.activeAdminModule === 'dashboard' || state.activeAdminModule === 'planeaciones';
    }

    function renderPlaneacionesSurface(options = {}) {
      const includeStats = options.includeStats !== false;
      const includePlaneaciones = options.includePlaneaciones !== false;
      const includeAlertas = options.includeAlertas !== false;
      if (includeStats) renderStats();
      if (canUseAdminShell()) renderAdminShell();
      if (includePlaneaciones && isPlaneacionesSurfaceVisible()) {
        renderPlaneacionesFilterSelects();
        renderPlaneacionesList();
        renderPlanBuilderVisibility();
        scheduleVisiblePlaneacionDetailPrefetch();
      }
      if (includeAlertas && isAlertasSurfaceVisible()) renderAlertas();
    }

    function scheduleUiDebounce(key, fn, delay = 140) {
      if (typeof fn !== 'function') return;
      if (!state.ui) {
        fn();
        return;
      }
      if (!state.ui.debounceTimers) state.ui.debounceTimers = {};
      const timers = state.ui.debounceTimers;
      if (timers[key]) window.clearTimeout(timers[key]);
      timers[key] = window.setTimeout(() => {
        delete timers[key];
        fn();
      }, delay);
    }

    function canPrefetchPlaneacionDetail(plan) {
      if (!plan || !plan.planeacion_id) return false;
      const status = String(plan.estado || '').trim();
      if (['cerrada', 'archivada', 'cierre_pendiente'].includes(status)) return false;
      if (isPlaneacionPendingCreation(plan)) return false;
      if (['creating', 'saving', 'activating', 'syncing', 'sync_error'].includes(getPlanLocalSaveState(plan))) return false;
      return !(plan.detail_loaded && hasUsableOpenPlanDetail(plan));
    }

    function getPlaneacionDetailPrefetchLimit(options = {}) {
      const requestedLimit = Number(options.limit || 0);
      if (requestedLimit > 0) return requestedLimit;
      return canUseAdminShell() ? ADMIN_PLAN_DETAIL_WARMUP_LIMIT : OPEN_PLAN_DETAIL_PREFETCH_LIMIT;
    }

    function getPlaneacionDetailPrefetchConcurrency(options = {}) {
      const requestedConcurrency = Number(options.concurrency || 0);
      if (requestedConcurrency > 0) return requestedConcurrency;
      return canUseAdminShell() ? ADMIN_PLAN_DETAIL_WARMUP_CONCURRENCY : OPEN_PLAN_DETAIL_PREFETCH_CONCURRENCY;
    }

    function getPlaneacionDetailPrefetchDelayMs() {
      return canUseAdminShell() ? ADMIN_PLAN_DETAIL_WARMUP_DELAY_MS : OPEN_PLAN_DETAIL_PREFETCH_DELAY_MS;
    }

    function getVisiblePlaneacionDetailPrefetchIds(options = {}) {
      if (!state.session || !state.session.token) return [];
      if (!state.ui || state.ui.planeacionesLoading || !state.ui.planeacionesLoaded) return [];
      if (!isPlaneacionesSurfaceVisible()) return [];
      const seen = new Set();
      const limit = getPlaneacionDetailPrefetchLimit(options);
      return getVisiblePlaneaciones()
        .map((plan, index) => ({ plan, index }))
        .filter(({ plan }) => {
          const planId = String((plan && plan.planeacion_id) || '').trim();
          if (!planId || seen.has(planId)) return false;
          seen.add(planId);
          return canPrefetchPlaneacionDetail(plan);
        })
        .slice(0, limit)
        .map(({ plan }) => String(plan.planeacion_id || '').trim())
        .filter(Boolean);
    }

    async function prefetchVisiblePlaneacionDetails(options = {}) {
      if (!state.ui || state.ui.planeacionDetailPrefetchRunning) return;
      const planIds = getVisiblePlaneacionDetailPrefetchIds(options);
      if (!planIds.length) return;
      state.ui.planeacionDetailPrefetchRunning = true;
      try {
        let nextIndex = 0;
        const loadNext = async () => {
          while (nextIndex < planIds.length) {
            const planId = planIds[nextIndex];
            nextIndex += 1;
            if (!isPlaneacionesSurfaceVisible()) break;
            const currentPlan = getPlanById(planId);
            if (!canPrefetchPlaneacionDetail(currentPlan)) continue;
            try {
              await ensurePlaneacionDetailLoaded(planId, { silent: true });
            } catch (_) {}
          }
        };
        const workerCount = Math.min(getPlaneacionDetailPrefetchConcurrency(options), planIds.length);
        await Promise.all(Array.from({ length: workerCount }, loadNext));
      } finally {
        if (state.ui) state.ui.planeacionDetailPrefetchRunning = false;
      }
    }

    function prioritizePlaneacionDetailPrefetch(planId) {
      const normalizedPlanId = String(planId || '').trim();
      if (!normalizedPlanId || !state.session || !state.session.token) return;
      if (!isPlaneacionesSurfaceVisible()) return;
      const currentPlan = getPlanById(normalizedPlanId);
      if (!canPrefetchPlaneacionDetail(currentPlan)) return;
      ensurePlaneacionDetailLoaded(normalizedPlanId, { silent: true }).catch(() => {});
    }

    function buildOpenPlanPrefetchIntentAttrs(planId) {
      const escapedPlanId = escapeJsAttrValue(planId);
      const action = "prioritizePlaneacionDetailPrefetch('" + escapedPlanId + "')";
      return ' onpointerenter="' + action + '"' +
        ' onpointerdown="' + action + '"' +
        ' onfocus="' + action + '"' +
        ' ontouchstart="' + action + '"';
    }

    function scheduleVisiblePlaneacionDetailPrefetch(delay = getPlaneacionDetailPrefetchDelayMs()) {
      if (!state.session || !state.session.token) return;
      if (!state.ui || !state.ui.planeacionesLoaded) return;
      if (!isPlaneacionesSurfaceVisible()) return;
      scheduleUiDebounce('planeacion-detail-prefetch', () => {
        prefetchVisiblePlaneacionDetails().catch(() => {});
      }, delay);
    }

    async function refreshPlaneacionesSurface(options = {}) {
      const includePlaneaciones = options.includePlaneaciones !== false;
      const includeAlertas = options.includeAlertas !== false;
      if (includePlaneaciones) {
        await refreshPlaneaciones();
        renderPlaneacionesSurface({
          includeStats: options.includeStats,
          includePlaneaciones: true,
          includeAlertas: false
        });
      }
      if (includeAlertas) {
        await refreshAlertas();
        renderPlaneacionesSurface({
          includeStats: false,
          includePlaneaciones: false,
          includeAlertas: true
        });
        return;
      }
      if (!includePlaneaciones) {
        renderPlaneacionesSurface({
          includeStats: options.includeStats,
          includePlaneaciones: false,
          includeAlertas: false
        });
      }
    }

    function renderActiveAdminModule(moduleName = state.activeAdminModule) {
      if (!canUseAdminShell()) return;
      ensureAdminShellMarkupLoaded();
      const normalized = String(moduleName || '').trim();
      if (isAdminModuleLoading(normalized)) {
        renderAdminModulePlaceholder(normalized);
        return;
      }
      if (getAdminModuleError(normalized)) {
        renderAdminModuleError(normalized);
        return;
      }
      if (adminModuleNeedsCatalogos(normalized) && !hasCatalogBlocksLoaded(getAdminModuleCatalogBlocks(normalized))) {
        renderAdminModulePlaceholder(normalized);
        return;
      }
      switch (normalized) {
        case 'notificaciones':
          renderNotificationsAdmin();
          break;
        case 'alumnos':
          renderAdminAlumnosModule();
          break;
        case 'facilitadores':
          renderAdminFacilitadoresModule();
          break;
        case 'materias':
          renderAdminMateriasModule();
          break;
        case 'talleres':
          renderAdminTalleresModule();
          break;
        case 'reporte-ciclo':
          renderAdminReporteCicloModule();
          break;
        case 'configuracion':
          renderAdminConfiguracionModule();
          break;
        default:
          break;
      }
    }

    function isAdminModuleLoading(moduleName) {
      const key = String(moduleName || '').trim();
      return !!(state.ui && state.ui.adminModuleLoading && state.ui.adminModuleLoading[key]);
    }

    function setAdminModuleLoading(moduleName, isLoading) {
      const key = String(moduleName || '').trim();
      if (!state.ui) return;
      if (!state.ui.adminModuleLoading || typeof state.ui.adminModuleLoading !== 'object') {
        state.ui.adminModuleLoading = {};
      }
      if (isLoading) state.ui.adminModuleLoading[key] = true;
      else delete state.ui.adminModuleLoading[key];
    }

    function getAdminModuleError(moduleName) {
      const key = String(moduleName || '').trim();
      return String(state.ui && state.ui.adminModuleErrors && state.ui.adminModuleErrors[key] || '').trim();
    }

    function setAdminModuleError(moduleName, message) {
      const key = String(moduleName || '').trim();
      if (!key || !state.ui) return;
      if (!state.ui.adminModuleErrors || typeof state.ui.adminModuleErrors !== 'object') {
        state.ui.adminModuleErrors = {};
      }
      const normalizedMessage = String(message || '').trim();
      if (normalizedMessage) state.ui.adminModuleErrors[key] = normalizedMessage;
      else delete state.ui.adminModuleErrors[key];
    }

    function getAdminModulePlaceholderCopy(moduleName) {
      switch (String(moduleName || '').trim()) {
        case 'planeaciones':
          return {
            title: 'Cargando planeaciones',
            body: 'Preparamos filtros y herramientas del m\u00f3dulo sin frenar la vista principal.'
          };
        case 'alumnos':
          return {
            title: 'Cargando alumnos',
            body: 'Se est\u00e1n hidratando grupos y fichas base para que el listado responda m\u00e1s r\u00e1pido.'
          };
        case 'facilitadores':
          return {
            title: 'Cargando facilitadores',
            body: 'Preparamos accesos, asignaciones y panel lateral de trabajo.'
          };
        case 'materias':
          return {
            title: 'Cargando materias',
            body: 'Se est\u00e1n organizando materias base y variantes activas.'
          };
        case 'talleres':
          return {
            title: 'Cargando talleres',
            body: 'Preparamos cat\u00e1logo base y relaciones activas sin congelar la navegaci\u00f3n.'
          };
        case 'notificaciones':
          return {
            title: 'Cargando notificaciones',
            body: 'Se est\u00e1 preparando la bandeja activa y el editor institucional.'
          };
        case 'reporte-ciclo':
          return {
            title: 'Cargando reporte de ciclo',
            body: 'Se est\u00e1n preparando alumnos y per\u00edodos para este m\u00f3dulo.'
          };
        default:
          return {
            title: 'Cargando m\u00f3dulo',
            body: 'Preparamos la informaci\u00f3n necesaria para mostrar este panel.'
          };
      }
    }

    function getAdminModuleDisplayName(moduleName) {
      switch (String(moduleName || '').trim()) {
        case 'dashboard':
          return 'Dashboard';
        case 'planeaciones':
          return 'Planeaciones';
        case 'alumnos':
          return 'Alumnos';
        case 'notificaciones':
          return 'Notificaciones';
        case 'reporte-ciclo':
          return 'Reporte de ciclo';
        case 'facilitadores':
          return 'Facilitadores';
        case 'materias':
          return 'Materias';
        case 'talleres':
          return 'Talleres';
        case 'configuracion':
          return 'Configuraci\u00f3n';
        default:
          return 'M\u00f3dulo';
      }
    }

    function renderAdminModulePlaceholder(moduleName) {
      const panel = $('admin-panel-' + String(moduleName || '').trim());
      if (!panel) return;
      const copy = getAdminModulePlaceholderCopy(moduleName);
      panel.innerHTML =
        '<article class="admin-placeholder">' +
          '<h3>' + escapeHtml(copy.title) + '</h3>' +
          '<p>' + escapeHtml(copy.body) + '</p>' +
        '</article>';
    }

    function renderAdminModuleError(moduleName) {
      const normalized = String(moduleName || '').trim();
      const panel = $('admin-panel-' + normalized);
      if (!panel) return;
      const message = getAdminModuleError(normalized) || 'No se pudo cargar este m\u00f3dulo.';
      panel.innerHTML =
        '<article class="admin-placeholder">' +
          '<h3>No se pudo cargar ' + escapeHtml(getAdminModuleDisplayName(normalized)) + '</h3>' +
          '<p>' + escapeHtml(message) + '</p>' +
          '<div class="actions compact">' +
            '<button class="btn-secondary" type="button" onclick="activateAdminModule(\'' + escapeJsAttrValue(normalized) + '\')">Reintentar</button>' +
          '</div>' +
        '</article>';
    }

    function getAdminNotificationsModuleTemplate() {
      return [
        '<article class="admin-toolbar">',
          '<div class="admin-toolbar-head">',
            '<div class="admin-notification-head-copy">',
              '<h3>Notificaciones globales</h3>',
              '<p class="subtle">Gestiona y envia avisos globales para facilitadores.</p>',
            '</div>',
            '<div class="admin-notification-toolbar-actions">',
              '<button id="adminNotificationFilterActiveBtn" class="btn-ghost" type="button">Ver activas</button>',
              '<button id="adminNotificationFilterScheduledBtn" class="btn-ghost" type="button">Ver programadas</button>',
              '<button id="adminNotificationFilterDraftBtn" class="btn-ghost" type="button">Ver borradores / archivadas</button>',
              '<button id="adminNotificationFilterClosedBtn" class="btn-ghost" type="button">Ver cerradas</button>',
              '<button id="adminNotificationNewBtn" class="btn-primary" type="button">Nueva notificaci&oacute;n</button>',
            '</div>',
          '</div>',
          '<div id="adminNotificationEditor" class="admin-notification-editor" hidden>',
            '<div class="admin-notification-section-head">',
              '<h4 id="adminNotificationEditorTitle">Nueva notificaci&oacute;n</h4>',
            '</div>',
            '<div class="admin-notification-editor-layout">',
              '<div class="admin-notification-editor-main">',
                '<div>',
                  '<label for="adminNotificationTitle">T&iacute;tulo</label>',
                  '<input id="adminNotificationTitle" type="text" maxlength="150" placeholder="T&iacute;tulo">',
                '</div>',
                '<div>',
                  '<label for="adminNotificationMessage">Mensaje</label>',
                  '<textarea id="adminNotificationMessage" placeholder="Ingresa el mensaje que ser&aacute; visible para los facilitadores."></textarea>',
                '</div>',
              '</div>',
              '<div class="admin-notification-editor-side">',
                '<div class="admin-notification-inline-grid">',
                  '<div>',
                    '<label for="adminNotificationPriority">Prioridad</label>',
                    '<select id="adminNotificationPriority">',
                      '<option value="normal">Normal</option>',
                      '<option value="alta">Alta</option>',
                    '</select>',
                  '</div>',
                  '<div>',
                    '<label for="adminNotificationStart">Fecha de inicio</label>',
                    '<input id="adminNotificationStart" type="date">',
                  '</div>',
                  '<div>',
                    '<label for="adminNotificationEnd">Fecha de cierre</label>',
                    '<input id="adminNotificationEnd" type="date">',
                  '</div>',
                '</div>',
                '<div>',
                  '<label for="adminNotificationAudience">Dirigido a</label>',
                  '<select id="adminNotificationAudience">',
                    '<option value="todos">Todos los facilitadores</option>',
                    '<option value="especificos">Facilitadores espec&iacute;ficos</option>',
                  '</select>',
                '</div>',
                '<div id="adminNotificationAudienceList" class="notification-audience-checklist" hidden></div>',
                '<div class="actions compact admin-notification-editor-actions">',
                  '<button id="adminNotificationSaveDraftBtn" class="btn-secondary" type="button">Guardar borrador</button>',
                  '<button id="adminNotificationPublishBtn" class="btn-primary" type="button">Publicar</button>',
                  '<button id="adminNotificationCancelBtn" class="btn-ghost" type="button">Cancelar</button>',
                '</div>',
              '</div>',
            '</div>',
          '</div>',
          '<div id="adminNotificationFeedback" class="inline-feedback"></div>',
          '<div class="admin-notification-section-head">',
            '<h4 id="adminNotificationListTitle">Notificaciones activas</h4>',
          '</div>',
          '<div id="adminNotificationsList" class="admin-notification-list"></div>',
        '</article>'
      ].join('');
    }

    function ensureAdminNotificationsModuleTemplate() {
      const panel = $('admin-panel-notificaciones');
      if (!panel || $('adminNotificationsList')) return false;
      panel.innerHTML = getAdminNotificationsModuleTemplate();
      return true;
    }

    function bindAdminNotificationsTemplateEvents() {
      const bind = (id, eventName, handler) => {
        const node = $(id);
        if (!node || (node.dataset && node.dataset.adminTemplateBound)) return;
        node.addEventListener(eventName, handler);
        if (node.dataset) node.dataset.adminTemplateBound = '1';
      };
      bind('adminNotificationNewBtn', 'click', () => openNotificationEditor());
      bind('adminNotificationFilterActiveBtn', 'click', () => setNotificationFilter('activas'));
      bind('adminNotificationFilterScheduledBtn', 'click', () => setNotificationFilter('programadas'));
      bind('adminNotificationFilterDraftBtn', 'click', () => setNotificationFilter('borradores'));
      bind('adminNotificationFilterClosedBtn', 'click', () => setNotificationFilter('cerradas'));
      bind('adminNotificationTitle', 'input', (event) => updateNotificationEditorField('titulo', event.currentTarget.value));
      bind('adminNotificationMessage', 'input', (event) => updateNotificationEditorField('mensaje', event.currentTarget.value));
      bind('adminNotificationPriority', 'change', (event) => updateNotificationEditorField('prioridad', event.currentTarget.value));
      bind('adminNotificationStart', 'change', (event) => updateNotificationEditorField('fecha_inicio', event.currentTarget.value));
      bind('adminNotificationEnd', 'change', (event) => updateNotificationEditorField('fecha_cierre', event.currentTarget.value));
      bind('adminNotificationAudience', 'change', (event) => updateNotificationEditorField('visible_para', event.currentTarget.value));
      bind('adminNotificationSaveDraftBtn', 'click', (event) => saveNotificationEditor(event.currentTarget, 'borrador'));
      bind('adminNotificationPublishBtn', 'click', (event) => saveNotificationEditor(event.currentTarget, 'publicada'));
      bind('adminNotificationCancelBtn', 'click', () => {
        resetNotificationEditor();
        renderNotificationsAdmin();
      });
    }

    function getAdminReporteCicloModuleTemplate() {
      return [
        '<article class="admin-toolbar admin-reporte-ciclo-module">',
          '<div class="admin-alumnos-head admin-reporte-ciclo-head">',
            '<div class="admin-alumnos-head-copy admin-reporte-ciclo-copy">',
              '<h3>Reporte de ciclo</h3>',
              '<p class="subtle">Genera, regenera y monitorea el PDF acad&eacute;mico familiar por alumno y per&iacute;odo sin salir del adminShell.</p>',
            '</div>',
            '<div class="admin-reporte-ciclo-kpis">',
              '<div class="admin-reporte-ciclo-kpi"><strong id="adminReporteKpiAlumnos">0</strong><span>Alumnos</span></div>',
              '<div class="admin-reporte-ciclo-kpi"><strong id="adminReporteKpiPeriodos">0</strong><span>Per&iacute;odos</span></div>',
              '<div class="admin-reporte-ciclo-kpi"><strong id="adminReporteKpiPdf">Sin consulta</strong><span>&Uacute;ltimo estado</span></div>',
            '</div>',
          '</div>',
          '<div class="admin-reporte-ciclo-layout">',
            '<div class="admin-reporte-ciclo-main">',
              '<div class="admin-reporte-ciclo-request">',
                '<div class="admin-reporte-ciclo-grid">',
                  '<div class="field"><label for="adminReportAlumno">Alumno</label><select id="adminReportAlumno"></select></div>',
                  '<div class="field"><label for="adminReportPeriodo">Per&iacute;odo</label><select id="adminReportPeriodo"></select></div>',
                '</div>',
                '<div class="admin-reporte-ciclo-actions actions compact">',
                  '<button id="adminGenerateNowBtn" class="btn-primary" type="button">Solicitar / actualizar</button>',
                  '<button id="adminRequestReportBtn" class="btn-secondary" type="button">Forzar regeneraci&oacute;n</button>',
                  '<button id="adminStatusReportBtn" class="btn-ghost" type="button">Revisar estado</button>',
                '</div>',
                '<div class="admin-reporte-ciclo-helper subtle">El PDF se genera desde backend y puede quedar listo de inmediato o unos segundos despu&eacute;s, seg&uacute;n el estado del cach&eacute;.</div>',
              '</div>',
              '<div class="admin-reporte-ciclo-preview-card">',
                '<div class="admin-alumnos-section-head"><h4>Vista del documento</h4></div>',
                '<div id="adminReportSelectionSummary" class="admin-reporte-ciclo-summary"></div>',
                '<div class="admin-reporte-ciclo-preview">',
                  '<div class="admin-reporte-ciclo-preview-sheet">',
                    '<div class="admin-reporte-ciclo-preview-header"><div class="admin-reporte-ciclo-preview-logo">LA</div><div><strong>Libre Aprendiz</strong><span>Reporte acad&eacute;mico para familias</span></div></div>',
                    '<div class="admin-reporte-ciclo-preview-strip"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>',
                    '<div class="admin-reporte-ciclo-preview-block"><div><strong id="adminReportPreviewAlumno">Selecciona un alumno</strong><span id="adminReportPreviewMeta">Grupo, matr&iacute;cula y facilitadora se resolver&aacute;n aqu&iacute;.</span></div><div class="admin-reporte-ciclo-badge" id="adminReportPreviewPeriodo">Per&iacute;odo</div></div>',
                    '<div class="admin-reporte-ciclo-preview-section">',
                      '<div class="admin-reporte-ciclo-preview-section-head"><div class="admin-reporte-ciclo-dot"></div><strong>ACTIVIDADES POR MATERIA</strong><span>Estado de realizaci&oacute;n</span></div>',
                      '<div class="admin-reporte-ciclo-preview-row"><span class="is-done">&#10003;</span><div>Actividad registrada del periodo</div><small>Sem 1</small></div>',
                      '<div class="admin-reporte-ciclo-preview-row"><span class="is-pending"></span><div>Actividad pendiente o sin dato visible</div><small>Sem 2</small></div>',
                      '<div class="admin-reporte-ciclo-preview-row"><span class="is-no">&times;</span><div>Actividad marcada como no realizada</div><small>Sem 3</small></div>',
                    '</div>',
                  '</div>',
                '</div>',
              '</div>',
            '</div>',
            '<aside class="admin-alumnos-panel admin-reporte-ciclo-side">',
              '<div class="admin-alumnos-panel-head"><h4>Estado y PDF</h4></div>',
              '<div id="adminReportResult" class="admin-reporte-ciclo-result"></div>',
              '<div class="admin-reporte-ciclo-notes">',
                '<div class="admin-reporte-ciclo-note"><strong>Incluye</strong><span>Encabezado institucional, datos del alumno, actividades por materia y pie familiar.</span></div>',
                '<div class="admin-reporte-ciclo-note"><strong>No incluye</strong><span>Observaciones internas, notas de direcci&oacute;n, IDs t&eacute;cnicos ni estados administrativos.</span></div>',
                '<div class="admin-reporte-ciclo-note"><strong>Salida final</strong><span>PDF en Drive con URL directa para abrir y compartir dentro de la operaci&oacute;n escolar.</span></div>',
              '</div>',
            '</aside>',
          '</div>',
        '</article>'
      ].join('');
    }

    function ensureAdminReporteCicloModuleTemplate() {
      const panel = $('admin-panel-reporte-ciclo');
      if (!panel || $('adminReportAlumno')) return false;
      panel.innerHTML = getAdminReporteCicloModuleTemplate();
      return true;
    }

    function bindAdminReporteCicloTemplateEvents() {
      const bind = (id, eventName, handler) => {
        const node = $(id);
        if (!node || (node.dataset && node.dataset.adminTemplateBound)) return;
        node.addEventListener(eventName, handler);
        if (node.dataset) node.dataset.adminTemplateBound = '1';
      };
      bind('adminReportAlumno', 'change', (event) => {
        setReporteSelection('alumno_id', event.currentTarget.value);
        renderAdminReporteCicloModule();
      });
      bind('adminReportPeriodo', 'change', (event) => {
        setReporteSelection('periodo_id', event.currentTarget.value);
        renderAdminReporteCicloModule();
      });
      bind('adminGenerateNowBtn', 'click', (event) => handleAction('requestReporteAlumno', generateReportNow, {
        button: event.currentTarget,
        key: buildActionKey('requestReporteAlumno', [getSelectedReporteAlumnoId(), getSelectedReportePeriodoId()])
      }));
      bind('adminRequestReportBtn', 'click', (event) => handleAction('regenerarReporteAlumno', requestReport, {
        button: event.currentTarget,
        key: buildActionKey('regenerarReporteAlumno', [getSelectedReporteAlumnoId(), getSelectedReportePeriodoId()])
      }));
      bind('adminStatusReportBtn', 'click', (event) => handleAction('getReporteAlumnoStatus', checkReportStatus, {
        button: event.currentTarget,
        key: buildActionKey('getReporteAlumnoStatus', [getSelectedReporteAlumnoId(), getSelectedReportePeriodoId()])
      }));
    }

    function renderAdminModuleSurface(moduleName = state.activeAdminModule, options = {}) {
      if (!canUseAdminShell()) return;
      if (options.includeStats !== false) renderStats();
      renderAdminShell();
      renderActiveAdminModule(moduleName);
      syncRoleUi();
    }

    async function refreshAdminModuleSurface(moduleName = state.activeAdminModule, options = {}) {
      if (!canUseAdminShell()) return;
      const targetModule = String(moduleName || state.activeAdminModule || '').trim();
      const tasks = [];
      if (options.refreshCatalogos !== false && adminModuleNeedsCatalogos(targetModule)) {
        tasks.push(refreshCatalogos({ blocks: getAdminModuleCatalogBlocks(targetModule) }));
      }
      if (options.refreshNotificaciones) tasks.push(refreshNotificaciones());
      if (options.refreshAlertas) tasks.push(refreshAlertas());
      if (tasks.length) await Promise.all(tasks);
      renderAdminModuleSurface(targetModule, { includeStats: options.includeStats });
    }

    function syncRoleUi() {
      const tabs = document.querySelector('.tabs');
      const seguimientoTabBtn = document.querySelector('.tab-btn[data-tab="seguimiento"]');
      const reportTabBtn = document.querySelector('.tab-btn[data-tab="reportes"]');
      const summaryCard = $('summaryCard');
      const alertsCard = $('alertsCard');
      const adminShell = $('adminShell');
      const adminPlaneacionesShell = $('adminPlaneacionesShell');
      const seguimientoPanel = $('panel-seguimiento');
      const reportPanel = $('panel-reportes');
      const estadoFilter = $('filterEstado');
      const role = getCurrentRole();
      const facilitatorMode = role === 'facilitador';
      const adminMode = canUseAdminShell();
      const canViewReportes = canUseReportes();
      if (tabs) tabs.hidden = facilitatorMode || adminMode;
      if (adminShell) adminShell.style.display = adminMode ? 'grid' : 'none';
      if (adminPlaneacionesShell) adminPlaneacionesShell.classList.toggle('is-active', !adminMode || state.activeAdminModule === 'planeaciones');
      if (summaryCard) summaryCard.hidden = facilitatorMode || (adminMode && state.activeAdminModule !== 'dashboard');
      if (alertsCard) {
        const hasVisibleAlerts = getVisibleOperationalAlerts().length > 0;
        alertsCard.hidden = (adminMode && state.activeAdminModule !== 'dashboard') || !hasVisibleAlerts;
      }
      if (seguimientoTabBtn) seguimientoTabBtn.hidden = facilitatorMode;
      if (seguimientoPanel) seguimientoPanel.hidden = facilitatorMode;
      if (reportTabBtn) reportTabBtn.hidden = !canViewReportes;
      if (reportPanel) reportPanel.hidden = facilitatorMode || adminMode || !canViewReportes;
      if (estadoFilter) {
        Array.from(estadoFilter.options).forEach((option) => {
          option.hidden = facilitatorMode && ['borrador_pendiente_aprobacion', 'rechazada', 'cierre_pendiente', 'cerrada', 'archivada'].includes(option.value);
        });
        if (facilitatorMode && ['borrador_pendiente_aprobacion', 'rechazada', 'cierre_pendiente', 'cerrada', 'archivada'].includes(estadoFilter.value)) {
          estadoFilter.value = '';
        }
      }
      ['filterGrupo', 'filterFacilitador', 'filterAlumnoSearch', 'clearAlumnoFilterBtn', 'filterAlumnoChip'].forEach((id) => {
        const el = $(id);
        if (el) el.hidden = facilitatorMode;
      });
      if (facilitatorMode) {
        if ($('filterGrupo')) $('filterGrupo').value = '';
        if ($('filterFacilitador')) $('filterFacilitador').value = '';
        if ($('filterAlumnoSearch')) $('filterAlumnoSearch').value = '';
        if ($('filterAlumnoId')) $('filterAlumnoId').value = '';
      }
      if (adminMode && !['dashboard', 'planeaciones', 'alumnos', 'notificaciones', 'reporte-ciclo', 'facilitadores', 'materias', 'talleres', 'configuracion'].includes(state.activeAdminModule)) {
        state.activeAdminModule = 'dashboard';
      }
      if (facilitatorMode && state.activeTab !== 'planeaciones') {
        state.activeTab = 'planeaciones';
      }
      if (!canViewReportes && state.activeTab === 'reportes') {
        state.activeTab = 'planeaciones';
      }
    }

    function renderSession() {
      const badge = $('sessionBadge');
      const info = $('sessionInfo');
      const logoutBtn = $('logoutBtn');
      const workspaceLogoutBtn = $('workspaceLogoutBtn');
      const workspaceSessionBar = $('workspaceSessionBar');
      const workspaceSessionCopy = $('workspaceSessionCopy');
      const user = state.session && state.session.usuario ? state.session.usuario : null;
      if (!user) {
        badge.textContent = 'Sin sesión';
        badge.className = 'pill';
        info.textContent = 'Aún no hay una sesión activa.';
        if (workspaceSessionCopy) {
          workspaceSessionCopy.innerHTML = '<strong>Sin sesión</strong><span class="mini">Libre Aprendiz</span>';
        }
        if (logoutBtn) logoutBtn.hidden = true;
        if (workspaceLogoutBtn) workspaceLogoutBtn.hidden = true;
        if (workspaceSessionBar) workspaceSessionBar.hidden = true;
        syncRoleUi();
        return;
      }
      badge.textContent = user.rol;
      badge.className = 'pill brand';
      info.innerHTML =
        '<strong>' + escapeHtml(user.nombre) + '</strong><br>' +
        '<span class="mini">' + escapeHtml(user.facilitador_id) + ' · ' +
        escapeHtml(user.rol) + '</span>';
      if (workspaceSessionCopy) {
        let restoreChip = '';
        if (state.ui && state.ui.restoreSnapshotSyncing) {
          restoreChip = '<span class="workspace-session-sync-chip" title="Datos restaurados mientras sincroniza en segundo plano">Restaurado · Sync</span>';
        } else if (state.ui && state.ui.restoreSnapshotSyncJustFinished) {
          restoreChip = '<span class="workspace-session-sync-chip is-done" title="Datos actualizados">Actualizado</span>';
        }
        workspaceSessionCopy.innerHTML =
          '<strong>' + escapeHtml(user.nombre) + '</strong><div class="workspace-session-meta"><span class="mini">' +
          escapeHtml(user.facilitador_id) + ' | ' + escapeHtml(user.rol) + '</span>' + restoreChip + '</div>';
      }
      if (logoutBtn) logoutBtn.hidden = false;
      if (workspaceLogoutBtn) workspaceLogoutBtn.hidden = false;
      if (workspaceSessionBar) workspaceSessionBar.hidden = false;
      syncRoleUi();
    }

    function renderStats() {
      const adminAlumnosCount = getAdminAlumnosCount();
      const dashboardAlumnoCount = state.dashboardStats && state.dashboardStats.alumnos_activos;
      const facilitatorAlumnoCount = state.catalogos.alumnos.length
        ? state.catalogos.alumnos.length
        : (dashboardAlumnoCount != null ? Number(dashboardAlumnoCount) : null);
      $('statAlumnos').textContent = String(canUseAdminShell()
        ? (adminAlumnosCount || Number(dashboardAlumnoCount || 0))
        : (facilitatorAlumnoCount != null ? facilitatorAlumnoCount : '--'));
      $('statPlaneaciones').textContent = String(Number(state.dashboardStats && state.dashboardStats.planeaciones_visibles || 0) || state.planeaciones.length || 0);
      $('statSemanas').textContent = String(state.catalogos.semanas.length || 0);
      $('statMaterias').textContent = String(state.catalogos.materias.length || Number(state.dashboardStats && state.dashboardStats.materias_activas || 0) || 0);
    }

    function closeOpenPlan() {
      state.openPlanId = '';
      state.openPlanDraft = null;
      if (state.ui) state.ui.openPlanLoadingId = '';
      persistCurrentBootSnapshot('planeacion_cerrada');
    }

    function exitPlanFocus() {
      closeOpenPlan();
      renderPlaneacionesList();
    }

    function resetPlaneacionesTransientUi() {
      closeOpenPlan();
      closePlanBuilder();
      renderPlanBuilderVisibility();
      renderPlaneacionesList();
    }

    async function loadMorePlaneaciones(button) {
      if (!state.ui || state.ui.planeacionesLoadingMore || !state.ui.planeacionesHasMore) return;
      await handleAction('cargar m\u00e1s planeaciones', async () => {
        await refreshPlaneaciones({ append: true });
        renderPlaneacionesList();
      }, {
        button,
        key: buildActionKey('loadMorePlaneaciones', [String(state.ui.planeacionesOffset || 0)]),
        busyText: 'Cargando...'
      });
    }

    function clearPlaneacionesMateriaFilter() {
      if (state.ui) state.ui.planeacionesMateriaFilter = '';
    }

    function activateAdminModule(moduleName) {
      if (!canUseAdminShell()) return;
      ensureAdminShellMarkupLoaded();
      bindWindowActionGroup('admin');
      const nextModule = moduleName || 'dashboard';
      if (nextModule !== 'notificaciones' && state.ui && state.ui.notificationEditorExpanded) {
        resetNotificationEditor();
      }
      if (nextModule !== 'alumnos') {
        state.alumnosUi.filter = 'activos';
        syncAdminAlumnosModule();
      }
      if (nextModule !== 'facilitadores') {
        closeFacilitadorEditor();
        closeFacilitadorPin();
        closeFacilitadorAsignacionEditor();
      }
      if (nextModule !== 'talleres') {
        closeTallerEditor();
        closeTallerMembershipEditor();
      }
      if (nextModule !== 'materias') {
        closeMateriaEditor();
        closeSubmateriaEditor();
      }
      if (nextModule !== 'planeaciones') {
        resetPlaneacionesTransientUi();
        clearPlaneacionesMateriaFilter();
      }
      if (nextModule === 'notificaciones' && state.ui) {
        state.ui.notificationFilter = 'activas';
      }
      state.activeAdminModule = nextModule;
      setAdminModuleError(nextModule, '');
      renderAdminShell();
      const bootstrappingNotificationsModule = nextModule === 'notificaciones' && (!Array.isArray(state.notificaciones) || !state.notificaciones.length);
      if (bootstrappingNotificationsModule) {
        setAdminModuleLoading(nextModule, true);
        renderAdminShell();
        renderActiveAdminModule(nextModule);
        const pendingNotificationsPrefetch = state.ui && state.ui.adminNotificationsPrefetchPromise;
        const loadNotifications = pendingNotificationsPrefetch
          ? pendingNotificationsPrefetch.then(() => {
              if (Array.isArray(state.notificaciones) && state.notificaciones.length) {
                return null;
              }
              return refreshAdminModuleSurface(nextModule, {
                includeStats: true,
                refreshNotificaciones: true
              });
            })
          : refreshAdminModuleSurface(nextModule, {
              includeStats: true,
              refreshNotificaciones: true
            });
        loadNotifications
          .then(() => {
            setAdminModuleLoading(nextModule, false);
            renderAdminModuleSurface(nextModule, { includeStats: false });
          })
          .catch((err) => {
            setAdminModuleLoading(nextModule, false);
            setAdminModuleError(nextModule, formatApiError(err));
            renderAdminModuleSurface(nextModule, { includeStats: false });
          });
      }
      if (nextModule === 'planeaciones' && state.ui && !state.ui.planeacionesLoaded) {
        refreshPlaneaciones()
          .then(() => renderPlaneacionesSurface({ includeStats: true, includePlaneaciones: true, includeAlertas: false }))
          .catch(() => {});
      }
      if (nextModule === 'planeaciones') {
        ensureAdminPlaneacionesFilterCatalogosAvailable({ render: true }).catch(() => {});
      }
      if (!bootstrappingNotificationsModule && adminModuleNeedsCatalogos(nextModule) && !hasCatalogBlocksLoaded(getAdminModuleCatalogBlocks(nextModule))) {
        setAdminModuleLoading(nextModule, true);
        renderAdminShell();
        renderActiveAdminModule(nextModule);
        refreshCatalogos({ blocks: getMissingCatalogBlocks(getAdminModuleCatalogBlocks(nextModule)) })
          .then(() => {
            setAdminModuleLoading(nextModule, false);
            if (nextModule === 'planeaciones') {
              renderBaseSelects();
              renderPlaneacionesSurface({ includeStats: true, includePlaneaciones: false, includeAlertas: false });
            } else {
              renderAdminModuleSurface(nextModule, { includeStats: false });
            }
          })
          .catch((err) => {
            setAdminModuleLoading(nextModule, false);
            setAdminModuleError(nextModule, formatApiError(err));
            renderAdminModuleSurface(nextModule, { includeStats: false });
          });
      }
      if (nextModule === 'configuracion' && !getMaintenanceUi().preview) {
        setAdminModuleLoading(nextModule, true);
        renderAdminShell();
        renderActiveAdminModule(nextModule);
        loadMaintenancePreview({ keepAudit: true })
          .then(() => {
            setAdminModuleLoading(nextModule, false);
            renderAdminModuleSurface(nextModule, { includeStats: false });
          })
          .catch((err) => {
            setAdminModuleLoading(nextModule, false);
            setAdminModuleError(nextModule, formatApiError(err));
            renderAdminModuleSurface(nextModule, { includeStats: false });
          });
      }
      if (nextModule === 'planeaciones') {
        renderPlaneacionesList();
        renderPlanBuilderVisibility();
      } else if (nextModule === 'dashboard') {
        renderAlertas();
      } else {
        renderActiveAdminModule(nextModule);
      }
      syncRoleUi();
    }

    function renderAdminShell() {
      if (!canUseAdminShell()) {
        const adminShell = $('adminShell');
        if (!adminShell) return;
        adminShell.style.display = 'none';
        return;
      }
      if (!ensureAdminShellMarkupLoaded()) return;
      const adminShell = $('adminShell');
      if (!adminShell) return;
      const user = state.session && state.session.usuario ? state.session.usuario : null;
      const openPlans = Number(state.dashboardStats && state.dashboardStats.planeaciones_abiertas || state.planeaciones.filter((plan) => ['borrador', 'borrador_pendiente_aprobacion', 'rechazada', 'activa', 'cierre_pendiente'].includes(String(plan.estado || '').trim())).length || 0);
      const closedPlans = Number(state.dashboardStats && state.dashboardStats.planeaciones_cerradas || state.planeaciones.filter((plan) => ['cerrada', 'archivada'].includes(String(plan.estado || '').trim())).length || 0);
      const openAlerts = Array.isArray(state.alertas) && state.alertas.length
        ? state.alertas.filter((alerta) => String(alerta.estado || '').trim() !== 'resuelta').length
        : Number(state.dashboardStats && state.dashboardStats.alertas_abiertas || 0);
      const activeFacilitadores = state.catalogos.facilitadores.filter((item) => isTruthyValue(item.activo)).length || Number(state.dashboardStats && state.dashboardStats.facilitadores_activos || 0);
      const visibleAlumnos = getAdminAlumnosCount() || Number(state.dashboardStats && state.dashboardStats.alumnos_activos || 0);
      const activeMaterias = state.catalogos.materias.length || Number(state.dashboardStats && state.dashboardStats.materias_activas || 0);
      const activeTalleres = (state.catalogos.talleres || []).length || (Array.isArray(state.catalogos.talleres_admin) ? state.catalogos.talleres_admin.filter((item) => String(item.estatus || '').trim() === 'activo').length : 0);

      if ($('adminShellTitle')) {
        $('adminShellTitle').textContent = 'Centro de control' + (user ? ' de ' + (user.nombre || user.nombre_mostrado || user.facilitador_id || '') : '');
      }
      if ($('adminRolePill')) {
        $('adminRolePill').textContent = user ? (user.rol === 'admin' ? 'Admin' : 'Directora') : 'Administraci\u00f3n';
      }
      if ($('adminKpiOpenPlans')) $('adminKpiOpenPlans').textContent = String(openPlans);
      if ($('adminKpiClosedPlans')) $('adminKpiClosedPlans').textContent = String(closedPlans);
      if ($('adminKpiAlerts')) $('adminKpiAlerts').textContent = String(openAlerts);
      if ($('adminKpiFacilitadores')) $('adminKpiFacilitadores').textContent = String(activeFacilitadores);
      if ($('adminCountAlumnos')) $('adminCountAlumnos').textContent = String(visibleAlumnos);
      if ($('adminCountPlaneaciones')) $('adminCountPlaneaciones').textContent = String(Number(state.dashboardStats && state.dashboardStats.planeaciones_visibles || 0) || state.planeaciones.length || 0);
      if ($('adminCountNotifications')) $('adminCountNotifications').textContent = String(
        (Array.isArray(state.notificaciones) && state.notificaciones.length
          ? (state.notificaciones || []).filter((row) => isNotificationActiveToday(row)).length
          : Number(state.dashboardStats && state.dashboardStats.notificaciones_activas || 0)) || 0
      );
      if ($('adminCountFacilitadoresCard')) $('adminCountFacilitadoresCard').textContent = String(activeFacilitadores);
      if ($('adminCountMaterias')) $('adminCountMaterias').textContent = String(activeMaterias);
      if ($('adminCountTalleres')) $('adminCountTalleres').textContent = String(activeTalleres);
      if ($('adminCountReportes')) $('adminCountReportes').textContent = getReportStatusLabel(getReportSelectionState().lastResult && (getReportSelectionState().lastResult.status || getReportSelectionState().lastResult.estado) || 'PDF');

      document.querySelectorAll('.admin-nav-btn').forEach((btn) => {
        const moduleName = String(btn.dataset.adminModule || '').trim();
        const isActive = moduleName === state.activeAdminModule;
        const isLoading = isAdminModuleLoading(moduleName);
        if (!btn.dataset.defaultText) btn.dataset.defaultText = btn.textContent;
        btn.classList.toggle('is-active', isActive);
        btn.classList.toggle('is-loading', isLoading);
        if (isLoading) {
          btn.setAttribute('aria-busy', 'true');
          btn.textContent = btn.dataset.defaultText + ' - Cargando...';
        } else {
          btn.removeAttribute('aria-busy');
          btn.textContent = btn.dataset.defaultText;
        }
      });
      document.querySelectorAll('.admin-panel').forEach((panel) => {
        panel.classList.toggle('is-active', panel.id === 'admin-panel-' + state.activeAdminModule);
      });
      if (String(state.activeAdminModule || '').trim() === 'dashboard') {
        scheduleAdminCatalogPrefetch(900);
        scheduleAdminNotificationsPrefetch(1180);
      }
    }

    function getTodayYmdLocal() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      return year + '-' + month + '-' + day;
    }

    function getNotificationAudienceIds(notification) {
      if (Array.isArray(notification && notification.facilitadores_ids_array)) {
        return notification.facilitadores_ids_array.filter(Boolean);
      }
      const raw = String(notification && notification.facilitadores_ids || '').trim();
      return raw ? raw.split(',').map((item) => String(item).trim()).filter(Boolean) : [];
    }

    function isNotificationActiveToday(notification) {
      const status = String(notification && notification.estatus || '').trim();
      if (status !== 'publicada') return false;
      const today = getTodayYmdLocal();
      const start = toYmdFrontend_(notification && notification.fecha_inicio || '');
      const end = toYmdFrontend_(notification && notification.fecha_cierre || '');
      if (start && today < start) return false;
      if (end && today > end) return false;
      return true;
    }

    function formatNotificationVigencia(notification) {
      const start = toYmdFrontend_(notification && notification.fecha_inicio || '');
      const end = toYmdFrontend_(notification && notification.fecha_cierre || '');
      if (start && end) return formatFechaHumana(start) + ' al ' + formatFechaHumana(end);
      if (start) return 'Desde ' + formatFechaHumana(start);
      if (end) return 'Hasta ' + formatFechaHumana(end);
      return 'Sin cierre definido';
    }

    function formatNotificationAudience(notification) {
      const visiblePara = String(notification && notification.visible_para || 'todos').trim();
      if (visiblePara !== 'especificos') return 'Todos los facilitadores';
      const ids = getNotificationAudienceIds(notification);
      const names = ids.map((id) => {
        const row = (state.catalogos.facilitadores || []).find((item) => item.facilitador_id === id);
        return row ? (row.nombre_mostrado || row.nombre_completo || row.facilitador_id) : id;
      }).filter(Boolean);
      return names.length ? names.join(', ') : 'Facilitadores espec\u00edficos';
    }

    function setNotificationEditorExpanded(next) {
      if (state.ui) state.ui.notificationEditorExpanded = !!next;
    }

    function resetNotificationEditor() {
      state.notificationEditor = createEmptyNotificationEditorState();
      setNotificationEditorExpanded(false);
    }

    function openNotificationEditor(notification) {
      const source = notification || createEmptyNotificationEditorState();
      state.notificationEditor = {
        notificacion_id: source.notificacion_id || '',
        titulo: source.titulo || '',
        mensaje: source.mensaje || '',
        prioridad: source.prioridad || 'normal',
        fecha_inicio: toYmdFrontend_(source.fecha_inicio || ''),
        fecha_cierre: toYmdFrontend_(source.fecha_cierre || ''),
        visible_para: source.visible_para || 'todos',
        facilitadores_ids: getNotificationAudienceIds(source),
        estatus: source.estatus || 'borrador'
      };
      setNotificationEditorExpanded(true);
      renderNotificationsAdmin();
    }

    function getFilteredAdminNotifications() {
      const filter = (state.ui && state.ui.notificationFilter) || 'activas';
      const rows = Array.isArray(state.notificaciones) ? state.notificaciones : [];
      if (filter === 'programadas') {
        const today = getTodayYmdLocal();
        return rows.filter((row) => {
          const status = String(row && row.estatus || '').trim();
          const start = toYmdFrontend_(row && row.fecha_inicio || '');
          return status === 'publicada' && !!start && start > today;
        });
      }
      if (filter === 'borradores') {
        return rows.filter((row) => ['borrador', 'archivada'].includes(String(row.estatus || '').trim()));
      }
      if (filter === 'cerradas') {
        return rows.filter((row) => String(row.estatus || '').trim() === 'cerrada');
      }
      return rows.filter((row) => isNotificationActiveToday(row));
    }

    function getNotificationFilterTitle() {
      const filter = (state.ui && state.ui.notificationFilter) || 'activas';
      if (filter === 'programadas') return 'Notificaciones programadas';
      if (filter === 'borradores') return 'Borradores y archivadas';
      if (filter === 'cerradas') return 'Notificaciones cerradas';
      return 'Notificaciones activas';
    }

    function getNotificationStatusLabel(status) {
      const value = String(status || '').trim();
      if (value === 'publicada') return 'Publicada';
      if (value === 'borrador') return 'Borrador';
      if (value === 'cerrada') return 'Cerrada';
      if (value === 'archivada') return 'Archivada';
      return value || 'Sin estado';
    }

    function getNotificationRelativeUpdateLabel(value) {
      const ymd = toYmdFrontend_(value);
      if (!ymd) return 'Sin registro';
      const today = new Date(getTodayYmdLocal() + 'T12:00:00');
      const target = new Date(ymd + 'T12:00:00');
      const diff = Math.round((today.getTime() - target.getTime()) / 86400000);
      if (diff <= 0) return 'Hoy';
      if (diff === 1) return 'Ayer';
      return 'Hace ' + diff + ' d\u00edas';
    }

    function getNotificationActionMessage(action, status) {
      if (action === 'publicarNotificacion') return 'Notificaci\u00f3n publicada.';
      if (action === 'despublicarNotificacion') return 'La notificaci\u00f3n volvi\u00f3 a borrador.';
      if (action === 'cerrarNotificacion') return 'Notificaci\u00f3n cerrada.';
      if (action === 'archivarNotificacion') return 'Notificaci\u00f3n archivada.';
      if (action === 'duplicarNotificacion') return 'Se cre\u00f3 una copia en borrador.';
      if (status === 'publicada') return 'Notificaci\u00f3n publicada.';
      if (status === 'borrador') return 'Borrador guardado.';
      return 'Notificaci\u00f3n actualizada.';
    }

    function getNotificationBusyText(action) {
      if (action === 'publicarNotificacion') return 'Publicando...';
      if (action === 'despublicarNotificacion') return 'Guardando...';
      if (action === 'cerrarNotificacion') return 'Cerrando...';
      if (action === 'archivarNotificacion') return 'Archivando...';
      if (action === 'duplicarNotificacion') return 'Duplicando...';
      return 'Guardando...';
    }

    function renderNotificationAudienceChecklist() {
      const host = $('adminNotificationAudienceList');
      if (!host) return;
      const show = String(state.notificationEditor.visible_para || 'todos') === 'especificos';
      host.hidden = !show;
      if (!show) {
        host.innerHTML = '';
        return;
      }
      const selected = new Set(state.notificationEditor.facilitadores_ids || []);
      const facilitadores = (state.catalogos.facilitadores || []).filter((item) => isTruthyValue(item.activo));
      host.innerHTML = facilitadores.map((row) => {
        const label = row.nombre_mostrado || row.nombre_completo || row.facilitador_id;
        return '<label class="check-item">' +
          '<input type="checkbox" value="' + escapeHtml(row.facilitador_id) + '"' + (selected.has(row.facilitador_id) ? ' checked' : '') + ' onchange="toggleNotificationAudienceFacilitador(\'' + escapeJsAttrValue(row.facilitador_id) + '\', this.checked)">' +
          '<span><strong>' + escapeHtml(label) + '</strong><br><span class="mini">' + escapeHtml(row.facilitador_id) + '</span></span>' +
        '</label>';
      }).join('') || '<div class="empty">No hay facilitadores activos disponibles.</div>';
    }

    function renderNotificationsAdmin() {
      const panel = $('admin-panel-notificaciones');
      if (!panel || !canUseAdminShell()) return;
      const rebuiltTemplate = ensureAdminNotificationsModuleTemplate();
      if (rebuiltTemplate) bindAdminNotificationsTemplateEvents();
      const activeBtn = $('adminNotificationFilterActiveBtn');
      const scheduledBtn = $('adminNotificationFilterScheduledBtn');
      const draftBtn = $('adminNotificationFilterDraftBtn');
      const closedBtn = $('adminNotificationFilterClosedBtn');
      const editor = $('adminNotificationEditor');
      const editorTitle = $('adminNotificationEditorTitle');
      const listTitle = $('adminNotificationListTitle');
      const title = $('adminNotificationTitle');
      const message = $('adminNotificationMessage');
      const priority = $('adminNotificationPriority');
      const start = $('adminNotificationStart');
      const end = $('adminNotificationEnd');
      const audience = $('adminNotificationAudience');
      const list = $('adminNotificationsList');
      const feedback = $('adminNotificationFeedback');
      if (editor) editor.hidden = !(state.ui && state.ui.notificationEditorExpanded);
      if (title) title.value = state.notificationEditor.titulo || '';
      if (message) message.value = state.notificationEditor.mensaje || '';
      if (priority) priority.value = state.notificationEditor.prioridad || 'normal';
      if (start) start.value = state.notificationEditor.fecha_inicio || '';
      if (end) end.value = state.notificationEditor.fecha_cierre || '';
      if (audience) audience.value = state.notificationEditor.visible_para || 'todos';
      if (editorTitle) editorTitle.textContent = state.notificationEditor.notificacion_id ? 'Editar notificaci\u00f3n' : 'Nueva notificaci\u00f3n';
      if (listTitle) listTitle.textContent = getNotificationFilterTitle();
      const filter = (state.ui && state.ui.notificationFilter) || 'activas';
      if (activeBtn) activeBtn.classList.toggle('is-active', filter === 'activas');
      if (scheduledBtn) scheduledBtn.classList.toggle('is-active', filter === 'programadas');
      if (draftBtn) draftBtn.classList.toggle('is-active', filter === 'borradores');
      if (closedBtn) closedBtn.classList.toggle('is-active', filter === 'cerradas');
      renderNotificationAudienceChecklist();
      if (feedback) feedback.textContent = '';
      if (!list) return;
      const rows = getFilteredAdminNotifications();
      if (!rows.length) {
        list.innerHTML = '<div class="empty">Todav\u00eda no hay notificaciones en esta vista.</div>';
        return;
      }
      list.innerHTML = '<div class="admin-notification-list-table">' +
        '<div class="admin-notification-list-header">' +
          '<div>T&iacute;tulo</div>' +
          '<div>Estado</div>' +
          '<div>Vigencia</div>' +
          '<div>Prioridad</div>' +
          '<div>Audiencia</div>' +
          '<div>&Uacute;ltima actualizaci&oacute;n</div>' +
          '<div>Acciones</div>' +
        '</div>' +
        rows.map((row) => {
        const high = String(row.prioridad || '').trim() === 'alta';
        const status = String(row.estatus || '').trim();
        const actions = [];
        if (status === 'borrador') {
          actions.push('<button class="btn-ghost" type="button" onclick="editNotification(\'' + escapeJsAttrValue(row.notificacion_id) + '\')">Editar</button>');
          actions.push('<button class="btn-primary" type="button" onclick="notificationAction(this, \'' + escapeJsAttrValue(row.notificacion_id) + '\', \'publicarNotificacion\')">Publicar</button>');
          actions.push('<button class="btn-ghost" type="button" onclick="notificationAction(this, \'' + escapeJsAttrValue(row.notificacion_id) + '\', \'archivarNotificacion\')">Archivar</button>');
        } else if (status === 'publicada') {
          actions.push('<button class="btn-ghost" type="button" onclick="editNotification(\'' + escapeJsAttrValue(row.notificacion_id) + '\')">Editar</button>');
          actions.push('<button class="btn-secondary" type="button" onclick="notificationAction(this, \'' + escapeJsAttrValue(row.notificacion_id) + '\', \'despublicarNotificacion\')">Despublicar</button>');
          actions.push('<button class="btn-accent" type="button" onclick="notificationAction(this, \'' + escapeJsAttrValue(row.notificacion_id) + '\', \'cerrarNotificacion\')">Cerrar</button>');
        } else if (status === 'cerrada') {
          actions.push('<button class="btn-ghost" type="button" onclick="notificationAction(this, \'' + escapeJsAttrValue(row.notificacion_id) + '\', \'duplicarNotificacion\')">Duplicar</button>');
          actions.push('<button class="btn-ghost" type="button" onclick="notificationAction(this, \'' + escapeJsAttrValue(row.notificacion_id) + '\', \'archivarNotificacion\')">Archivar</button>');
        } else if (status === 'archivada') {
          actions.push('<button class="btn-ghost" type="button" onclick="notificationAction(this, \'' + escapeJsAttrValue(row.notificacion_id) + '\', \'duplicarNotificacion\')">Duplicar</button>');
        }
        return '<article class="admin-notification-row' + (high ? ' is-high' : '') + '">' +
          '<div class="admin-notification-title">' +
            '<strong>' + escapeHtml(row.titulo || 'Sin titulo') + '</strong>' +
            '<div class="admin-notification-message mini">' + escapeHtml(row.mensaje || '') + '</div>' +
          '</div>' +
          '<div class="admin-notification-meta-stack">' +
            '<span class="notice-chip ' + escapeHtml(status) + '">' + escapeHtml(getNotificationStatusLabel(status)) + '</span>' +
          '</div>' +
          '<div class="admin-notification-cell">' +
            '<div class="mini">' + escapeHtml(formatNotificationVigencia(row)) + '</div>' +
          '</div>' +
          '<div class="admin-notification-meta-stack">' +
            '<span class="notice-chip' + (high ? ' high' : '') + '">' + escapeHtml(high ? 'Alta' : 'Normal') + '</span>' +
          '</div>' +
          '<div class="admin-notification-cell">' +
            '<div class="mini">' + escapeHtml(formatNotificationAudience(row)) + '</div>' +
          '</div>' +
          '<div class="admin-notification-cell">' +
            '<div class="mini">' + escapeHtml(getNotificationRelativeUpdateLabel(row.fecha_actualizacion || row.fecha_creacion || '')) + '</div>' +
          '</div>' +
          '<div class="admin-notification-actions">' +
            actions.join('') +
          '</div>' +
        '</article>';
      }).join('') +
      '</div>';
    }

    function renderInstitutionalNotices() {
      const card = $('institutionalNoticesCard');
      const host = $('institutionalNoticesList');
      if (!card || !host) return;
      const facilitatorMode = getCurrentRole() === 'facilitador';
      const rows = facilitatorMode ? (state.notificaciones || []) : [];
      card.hidden = !facilitatorMode || !rows.length;
      if (card.hidden) {
        host.innerHTML = '';
        return;
      }
      host.innerHTML = rows.map((row) => {
        const high = String(row.prioridad || '').trim() === 'alta';
        return '<article class="institutional-notice-card' + (high ? ' is-high' : '') + '">' +
          '<div class="institutional-notice-top">' +
            '<div><h3>' + escapeHtml(row.titulo || 'Aviso institucional') + '</h3></div>' +
            '<div class="institutional-notice-meta"><span class="notice-chip' + (high ? ' high' : '') + '">' + escapeHtml(high ? 'Alta' : 'Normal') + '</span></div>' +
          '</div>' +
          '<div class="institutional-notice-message">' + escapeHtml(row.mensaje || '') + '</div>' +
          '<div class="mini">Vigencia: ' + escapeHtml(formatNotificationVigencia(row)) + '</div>' +
        '</article>';
      }).join('');
    }

    function setNotificationFilter(filter) {
      if (state.ui) state.ui.notificationFilter = filter || 'activas';
      renderNotificationsAdmin();
    }

    function updateNotificationEditorField(field, value) {
      if (!state.notificationEditor) state.notificationEditor = createEmptyNotificationEditorState();
      state.notificationEditor[field] = value;
      if (field === 'visible_para') {
        if (value !== 'especificos') state.notificationEditor.facilitadores_ids = [];
        renderNotificationsAdmin();
      }
    }

    function toggleNotificationAudienceFacilitador(facilitadorId, checked) {
      const selected = new Set(state.notificationEditor.facilitadores_ids || []);
      if (checked) selected.add(facilitadorId);
      else selected.delete(facilitadorId);
      state.notificationEditor.facilitadores_ids = Array.from(selected);
    }

    function editNotification(notificationId) {
      const row = (state.notificaciones || []).find((item) => item.notificacion_id === notificationId);
      if (!row) return;
      openNotificationEditor(row);
    }

    function buildNotificationPayload(statusOverride) {
      return {
        notificacion_id: state.notificationEditor.notificacion_id || '',
        titulo: String(state.notificationEditor.titulo || '').trim(),
        mensaje: String(state.notificationEditor.mensaje || '').trim(),
        prioridad: state.notificationEditor.prioridad || 'normal',
        fecha_inicio: state.notificationEditor.fecha_inicio || '',
        fecha_cierre: state.notificationEditor.fecha_cierre || '',
        visible_para: state.notificationEditor.visible_para || 'todos',
        facilitadores_ids: state.notificationEditor.visible_para === 'especificos' ? (state.notificationEditor.facilitadores_ids || []) : [],
        estatus: statusOverride || state.notificationEditor.estatus || 'borrador',
        request_id: uid('NOTI')
      };
    }

    async function saveNotificationEditor(button, targetStatus) {
      ensureLoggedIn();
      const wantsPublish = targetStatus === 'publicada';
      const isEditing = !!(state.notificationEditor && state.notificationEditor.notificacion_id);
      await handleAction(wantsPublish ? 'publicarNotificacion' : 'guardarNotificacion', async () => {
        if (wantsPublish) {
          const saveStatus = state.notificationEditor.notificacion_id
            ? (state.notificationEditor.estatus || 'borrador')
            : 'borrador';
          const saved = await api('guardarNotificacion', buildNotificationPayload(saveStatus));
          const notificationId = (saved && saved.notificacion_id) || state.notificationEditor.notificacion_id || '';
          if (!notificationId) throw new Error('No se pudo preparar la notificaci\u00f3n para publicar.');
          await api('publicarNotificacion', {
            notificacion_id: notificationId,
            request_id: uid('NOTIP')
          });
        } else {
          await api('guardarNotificacion', buildNotificationPayload(targetStatus || 'borrador'));
        }
        if (state.ui) state.ui.notificationFilter = 'activas';
        resetNotificationEditor();
        await refreshAdminModuleSurface('notificaciones', {
          refreshCatalogos: false,
          refreshNotificaciones: true,
          includeStats: false
        });
        setBanner(
          targetStatus === 'publicada'
            ? (isEditing ? 'Notificaci\u00f3n actualizada y publicada.' : 'Notificaci\u00f3n publicada.')
            : (isEditing ? 'Cambios del borrador guardados.' : 'Borrador guardado. Puedes verlo en Ver borradores / archivadas.'),
          'success'
        );
      }, {
        button,
        busyText: button ? button.textContent : (targetStatus === 'publicada' ? 'Publicar' : 'Guardar borrador'),
        key: buildActionKey('guardarNotificacion', [state.notificationEditor.notificacion_id || 'new', targetStatus || 'borrador'])
      });
    }

    async function notificationAction(button, notificationId, action) {
      ensureLoggedIn();
      await handleAction(action, async () => {
        await api(action, { notificacion_id: notificationId, request_id: uid('NOTIA') });
        if (state.notificationEditor.notificacion_id === notificationId) {
          resetNotificationEditor();
        }
        if (state.ui) state.ui.notificationFilter = 'activas';
        await refreshAdminModuleSurface('notificaciones', {
          refreshCatalogos: false,
          refreshNotificaciones: true,
          includeStats: false
        });
        return;
      }, { button, busyText: button ? button.textContent : getNotificationBusyText(action), key: buildActionKey(action, [notificationId]) });
    }

    function splitAlumnoNombreCompleto(fullName) {
      const parts = String(fullName || '').trim().split(/\s+/).filter(Boolean);
      if (!parts.length) return { nombres: '', apellidos: '' };
      if (parts.length === 1) return { nombres: parts[0], apellidos: '' };
      if (parts.length === 2) return { nombres: parts[0], apellidos: parts[1] };
      return {
        nombres: parts.slice(0, parts.length - 2).join(' '),
        apellidos: parts.slice(-2).join(' ')
      };
    }

    function composeAlumnoNombreCompleto(nombres, apellidos) {
      return [String(nombres || '').trim(), String(apellidos || '').trim()].filter(Boolean).join(' ').trim();
    }

    function buildAlumnoAliasSuggestion(nombres, fullName) {
      const tokens = String(nombres || fullName || '')
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2);
      return tokens.join(' ').trim();
    }

    function composeAlumnoNombreMostrado(nombres, alias, fullName) {
      return String(alias || '').trim() || buildAlumnoAliasSuggestion(nombres, fullName) || String(fullName || '').trim();
    }

    function syncAlumnoAliasSuggestion(options = {}) {
      const editor = state.alumnosUi && state.alumnosUi.editor ? state.alumnosUi.editor : null;
      if (!editor) return;
      const force = !!options.force;
      const nextAlias = buildAlumnoAliasSuggestion(editor.nombres, composeAlumnoNombreCompleto(editor.nombres, editor.apellidos));
      if (force || !editor.aliasTouched || !String(editor.alias || '').trim()) {
        editor.alias = nextAlias;
        const aliasInput = $('adminAlumnoAlias');
        if (aliasInput && aliasInput.value !== nextAlias) aliasInput.value = nextAlias;
      }
    }

    function getGrupoDisplayName(group) {
      if (!group) return '';
      return String(group.nombre_grupo || group.grupo_id || '').trim() || String(group.grupo_id || '').trim();
    }

    function getGrupoById(grupoId) {
      return getCatalogIndex().gruposById.get(String(grupoId || '').trim()) || null;
    }

    function getMateriaById(materiaId) {
      return getCatalogIndex().materiasById.get(String(materiaId || '').trim()) || null;
    }

    function getGrupoNombre(grupoId) {
      if (!grupoId) return 'Sin grupo';
      const row = getGrupoById(grupoId);
      return row ? getGrupoDisplayName(row) : grupoId;
    }

    function getAlumnoStatusVisual(row) {
      const status = String(row && row.estatus || '').trim().toLowerCase();
      if (row && row.__archived) return 'archivado';
      if (status === 'pausa') return 'pausa';
      if (status === 'inactivo') return 'inactivo';
      if (status === 'egresado') return 'egresado';
      if (status === 'baja') return 'archivado';
      return 'activo';
    }

    function getAlumnoStatusLabel(status) {
      if (status === 'pausa') return 'Pausa';
      if (status === 'inactivo') return 'Inactivo';
      if (status === 'egresado') return 'Egresado';
      if (status === 'archivado') return 'Archivado';
      return 'Activo';
    }

    function compactAlumnoHistoryText(value, maxLength = 120) {
      const text = String(value || '').replace(/\s+/g, ' ').trim();
      if (!text || text.length <= maxLength) return text;
      return text.slice(0, Math.max(0, maxLength - 3)).trim() + '...';
    }

    function formatAlumnoHistoryValue(value) {
      const text = compactAlumnoHistoryText(value, 90);
      return text ? '"' + text + '"' : 'sin dato';
    }

    function buildAlumnoFichaHistoryDetail(before, after, statusNote) {
      if (!before) return 'Se agreg\u00f3 un nuevo alumno al cat\u00e1logo.';
      const changes = [];
      const addTextChange = (label, previousValue, nextValue) => {
        const previousText = String(previousValue || '').trim();
        const nextText = String(nextValue || '').trim();
        if (previousText === nextText) return;
        changes.push(label + ': ' + formatAlumnoHistoryValue(previousText) + ' -> ' + formatAlumnoHistoryValue(nextText) + '.');
      };
      addTextChange('Matr\u00edcula', before.matricula, after.matricula);
      addTextChange('Nombre completo', before.nombre_completo, after.nombre_completo);
      addTextChange('Alias visible', before.nombre_mostrado, after.nombre_mostrado);
      const previousGroup = String(before.grupo_id || '').trim();
      const nextGroup = String(after.grupo_id || '').trim();
      if (previousGroup !== nextGroup) {
        changes.push('Grupo: ' + getGrupoNombre(previousGroup) + ' -> ' + getGrupoNombre(nextGroup) + '.');
      }
      const previousStatus = getAlumnoStatusVisual(before);
      const nextStatus = getAlumnoStatusVisual({ estatus: after.estatus });
      if (previousStatus !== nextStatus) {
        changes.push('Estatus: ' + getAlumnoStatusLabel(previousStatus) + ' -> ' + getAlumnoStatusLabel(nextStatus) + '. Nota: ' + compactAlumnoHistoryText(statusNote, 160));
      }
      const previousNotes = String(getAlumnoAdminNotes(before.alumno_id, before.notas_internas || '') || '').trim();
      const nextNotes = String(after.notas_internas || '').trim();
      if (previousNotes !== nextNotes) {
        if (nextNotes && previousNotes) {
          changes.push('Observaci\u00f3n administrativa actualizada: ' + formatAlumnoHistoryValue(nextNotes) + '.');
        } else if (nextNotes) {
          changes.push('Observaci\u00f3n administrativa agregada: ' + formatAlumnoHistoryValue(nextNotes) + '.');
        } else {
          changes.push('Observaci\u00f3n administrativa eliminada.');
        }
      }
      return changes.join(' ') || 'Se guard\u00f3 la ficha sin cambios visibles.';
    }

    function requestAlumnoStatusHistoryNote(alumno, nextStatus, title) {
      const fromLabel = getAlumnoStatusLabel(getAlumnoStatusVisual(alumno));
      const toLabel = getAlumnoStatusLabel(getAlumnoStatusVisual({ estatus: nextStatus }));
      const promptText = [
        'Nota obligatoria para historial.',
        (title || 'Cambio de estatus') + ': ' + fromLabel + ' -> ' + toLabel + '.',
        'Ejemplo: falta de pago, regreso autorizado, cierre administrativo.'
      ].join('\n');
      const value = window.prompt(promptText, '');
      if (value === null) return null;
      const note = String(value || '').trim();
      if (!note) {
        setBanner('Captura una nota para guardar el cambio de estatus.', 'error');
        return null;
      }
      return note;
    }

    function buildAlumnoStatusHistoryDetail(baseDetail, statusNote) {
      return String(baseDetail || 'Se actualiz\u00f3 el estatus del alumno.').trim() + ' Nota: ' + compactAlumnoHistoryText(statusNote, 160);
    }

    function getAlumnoStatusBadgeClass(status) {
      if (status === 'pausa') return 'is-paused';
      if (status === 'inactivo') return 'is-inactive';
      if (status === 'egresado') return 'is-graduated';
      if (status === 'archivado') return 'is-archived';
      return 'is-active';
    }

    function getAlumnoStatusSortWeight(status) {
      if (status === 'activo') return 0;
      if (status === 'pausa') return 1;
      if (status === 'inactivo') return 2;
      if (status === 'egresado') return 3;
      return 4;
    }

    function getAlumnoAdminNotes(alumnoId, fallback) {
      const notes = state.alumnosUi && state.alumnosUi.notesByAlumno ? state.alumnosUi.notesByAlumno : {};
      if (Object.prototype.hasOwnProperty.call(notes, alumnoId)) return notes[alumnoId] || '';
      return String(fallback || '').trim();
    }

    function normalizeAlumnoRowForAdmin(row, source) {
      const normalized = Object.assign({}, row || {});
      normalized.alumno_id = String(normalized.alumno_id || '').trim();
      normalized.matricula = String(normalized.matricula || '').trim();
      normalized.nombre_completo = String(normalized.nombre_completo || '').trim();
      normalized.nombre_mostrado = String(normalized.nombre_mostrado || '').trim();
      normalized.grupo_id = String(normalized.grupo_id || '').trim();
      normalized.estatus = String(normalized.estatus || 'activo').trim().toLowerCase();
      normalized.fecha_alta = toYmdFrontend_(normalized.fecha_alta || '');
      normalized.fecha_baja = toYmdFrontend_(normalized.fecha_baja || '');
      normalized.archivado_at = normalized.archivado_at || '';
      normalized.archivado_por = normalized.archivado_por || '';
      normalized.notas_internas = getAlumnoAdminNotes(normalized.alumno_id, normalized.notas_internas || '');
      normalized.__source = source || normalized.__source || 'catalogo';
      normalized.__archived = !!normalized.__archived;
      return normalized;
    }

    function buildAlumnoSourceRows() {
      const signature = [
        getCatalogosRevision(),
        getAlumnosSourceRevision()
      ].join(':');
      if (alumnoSourceMemo.signature === signature) {
        return alumnoSourceMemo.rows;
      }
      const catalogRows = Array.isArray(state.catalogos.alumnos) ? state.catalogos.alumnos : [];
      const shadowRows = Object.values((state.alumnosUi && state.alumnosUi.archivedShadow) || {});
      const mockRows = Array.isArray(state.alumnosUi && state.alumnosUi.mockRows) ? state.alumnosUi.mockRows : [];
      const byId = new Map();
      catalogRows.forEach((row) => {
        const normalized = normalizeAlumnoRowForAdmin(row, 'catalogo');
        if (normalized.alumno_id) byId.set(normalized.alumno_id, normalized);
      });
      shadowRows.forEach((row) => {
        const normalized = normalizeAlumnoRowForAdmin(Object.assign({}, row, { __archived: true }), 'shadow');
        if (normalized.alumno_id) byId.set(normalized.alumno_id, normalized);
      });
      mockRows.forEach((row) => {
        const normalized = normalizeAlumnoRowForAdmin(row, 'mock');
        if (normalized.alumno_id && !byId.has(normalized.alumno_id)) byId.set(normalized.alumno_id, normalized);
      });
      const rows = Array.from(byId.values());
      alumnoSourceMemo.signature = signature;
      alumnoSourceMemo.rows = rows;
      alumnoSourceMemo.byId = byId;
      return rows;
    }

    function getAlumnoById(alumnoId) {
      const id = String(alumnoId || '').trim();
      if (!id) return null;
      buildAlumnoSourceRows();
      return alumnoSourceMemo.byId.get(id) || null;
    }

    function upsertCatalogEntityRow(collectionKey, idField, row, options = {}) {
      if (!state.catalogos || !collectionKey || !idField || !row || !row[idField]) return null;
      if (!Array.isArray(state.catalogos[collectionKey])) state.catalogos[collectionKey] = [];
      const rows = state.catalogos[collectionKey];
      const id = String(row[idField] || '').trim();
      const index = rows.findIndex((item) => String((item && item[idField]) || '').trim() === id);
      if (index === -1) {
        if (options.append) rows.push(row);
        else rows.unshift(row);
        bumpCatalogosRevision();
        return row;
      }
      rows.splice(index, 1, Object.assign({}, rows[index], row));
      bumpCatalogosRevision();
      return rows[index];
    }

    function applySavedAlumnoCatalogRow(row) {
      return upsertCatalogEntityRow('alumnos', 'alumno_id', row);
    }

    function applyPatchedAlumnoCatalogRow(alumnoId, patch = {}) {
      const current = getAlumnoById(alumnoId);
      if (!current) return null;
      return applySavedAlumnoCatalogRow(Object.assign({}, current, patch));
    }

    function pushAlumnoHistory(alumnoId, tipo, titulo, detalle, fecha) {
      const id = String(alumnoId || '').trim();
      if (!id) return;
      if (!state.alumnosUi.historyByAlumno[id]) state.alumnosUi.historyByAlumno[id] = [];
      state.alumnosUi.historyByAlumno[id].unshift({
        entry_id: uid('ALUH'),
        tipo: tipo || 'evento',
        titulo: titulo || 'Movimiento',
        detalle: detalle || '',
        fecha: fecha || new Date().toISOString()
      });
      state.alumnosUi.historyByAlumno[id] = state.alumnosUi.historyByAlumno[id].slice(0, 24);
    }

    function seedAlumnoHistory(alumno) {
      const rows = [];
      if (!alumno) return rows;
      if (alumno.fecha_alta) {
        rows.push({
          entry_id: 'seed-alta-' + alumno.alumno_id,
          tipo: 'alta',
          titulo: 'Alta de alumno',
          detalle: 'Registro inicial del alumno en el cat\u00e1logo.',
          fecha: alumno.fecha_alta
        });
      }
      if (alumno.__archived && (alumno.archivado_at || alumno.fecha_baja)) {
        rows.push({
          entry_id: 'seed-archivado-' + alumno.alumno_id,
          tipo: 'archivado',
          titulo: 'Alumno archivado',
          detalle: 'Se marc\u00f3 como archivado dentro del cat\u00e1logo escolar.',
          fecha: alumno.archivado_at || alumno.fecha_baja
        });
      }
      const visualStatus = getAlumnoStatusVisual(alumno);
      if (visualStatus === 'pausa') {
        rows.push({
          entry_id: 'seed-pausa-' + alumno.alumno_id,
          tipo: 'pausa',
          titulo: 'Alumno en pausa',
          detalle: 'El alumno qued\u00f3 en pausa dentro del cat\u00e1logo.',
          fecha: alumno.fecha_baja || alumno.fecha_alta || ''
        });
      }
      if (visualStatus === 'inactivo') {
        rows.push({
          entry_id: 'seed-inactivo-' + alumno.alumno_id,
          tipo: 'inactivo',
          titulo: 'Alumno inactivo',
          detalle: 'El alumno qued\u00f3 marcado como inactivo en el cat\u00e1logo.',
          fecha: alumno.fecha_baja || alumno.fecha_alta || ''
        });
      }
      if (visualStatus === 'egresado') {
        rows.push({
          entry_id: 'seed-egresado-' + alumno.alumno_id,
          tipo: 'egresado',
          titulo: 'Alumno egresado',
          detalle: 'El alumno qued\u00f3 registrado como egresado.',
          fecha: alumno.fecha_baja || alumno.fecha_alta || ''
        });
      }
      return rows;
    }

    function getAlumnoHistorial(alumnoId) {
      const alumno = getAlumnoById(alumnoId);
      const seeded = seedAlumnoHistory(alumno);
      const remoteLoaded = !!(state.alumnosUi.remoteHistoryLoadedByAlumno && state.alumnosUi.remoteHistoryLoadedByAlumno[String(alumnoId || '').trim()]);
      const remoteRows = Array.isArray(state.alumnosUi.remoteHistoryByAlumno[String(alumnoId || '').trim()])
        ? state.alumnosUi.remoteHistoryByAlumno[String(alumnoId || '').trim()]
        : [];
      const localRows = Array.isArray(state.alumnosUi.historyByAlumno[String(alumnoId || '').trim()])
        ? state.alumnosUi.historyByAlumno[String(alumnoId || '').trim()]
        : [];
      if (remoteLoaded) {
        return remoteRows.slice().sort((a, b) => new Date(b.fecha || 0).getTime() - new Date(a.fecha || 0).getTime());
      }
      return seeded
        .concat(localRows)
        .sort((a, b) => new Date(b.fecha || 0).getTime() - new Date(a.fecha || 0).getTime());
    }

    function getFilteredAlumnos() {
      const rows = buildAlumnoSourceRows();
      const filter = String(state.alumnosUi.filter || 'activos').trim();
      const groupFilter = String(state.alumnosUi.grupo || '').trim();
      const query = String(state.alumnosUi.search || '').trim().toLowerCase();
      return rows
        .filter((row) => {
          const visualStatus = getAlumnoStatusVisual(row);
          if (filter === 'activos' && visualStatus !== 'activo') return false;
          if (filter === 'pausa' && visualStatus !== 'pausa') return false;
          if (filter === 'inactivos' && visualStatus !== 'inactivo') return false;
          if (filter === 'egresados' && visualStatus !== 'egresado') return false;
          if (filter === 'archivados' && visualStatus !== 'archivado') return false;
          if (groupFilter && String(row.grupo_id || '').trim() !== groupFilter) return false;
          if (!query) return true;
          const haystack = [row.matricula, row.alumno_id, getAlumnoCompactId(row), row.nombre_completo, row.nombre_mostrado].join(' ').toLowerCase();
          return haystack.includes(query);
        })
        .sort((a, b) => {
          const visualA = getAlumnoStatusSortWeight(getAlumnoStatusVisual(a));
          const visualB = getAlumnoStatusSortWeight(getAlumnoStatusVisual(b));
          if (visualA !== visualB) return visualA - visualB;
          return String(a.nombre_completo || a.nombre_mostrado || a.alumno_id).localeCompare(String(b.nombre_completo || b.nombre_mostrado || b.alumno_id), 'es');
        });
    }

    function getVisibleAlumnos() {
      return getFilteredAlumnos();
    }

    function getAdminAlumnosCount() {
      return buildAlumnoSourceRows()
        .filter((row) => getAlumnoStatusVisual(row) === 'activo')
        .length;
    }

    function getAlumnoListTitle() {
      const filter = String(state.alumnosUi.filter || 'activos').trim();
      if (filter === 'todos') return 'Todos los alumnos';
      if (filter === 'pausa') return 'Alumnos en pausa';
      if (filter === 'inactivos') return 'Alumnos inactivos';
      if (filter === 'egresados') return 'Alumnos egresados';
      if (filter === 'archivados') return 'Alumnos archivados';
      return 'Alumnos activos';
    }

    function formatAlumnoUpdatedLabel(alumno) {
      const latest = alumno
        ? (alumno.fecha_actualizacion || alumno.archivado_at || alumno.fecha_alta || '')
        : '';
      if (!latest) return 'Sin registro';
      return getNotificationRelativeUpdateLabel(latest);
    }

    function closeAlumnoEditor() {
      state.alumnosUi.editorOpen = false;
      state.alumnosUi.editorMode = 'new';
      state.alumnosUi.selectedAlumnoId = '';
      state.alumnosUi.editor = createEmptyAlumnoEditorState();
    }

    function closeCambioGrupo() {
      state.alumnosUi.cambioGrupoOpen = false;
      state.alumnosUi.cambioGrupo = createEmptyAlumnoCambioState();
    }

    function closeAlumnoHistorial() {
      state.alumnosUi.historialOpen = false;
      state.alumnosUi.historialAlumnoId = '';
    }

    function isAlumnoEditorDirty() {
      if (!state.alumnosUi || !state.alumnosUi.editorOpen) return false;
      const editor = state.alumnosUi.editor || createEmptyAlumnoEditorState();
      if (state.alumnosUi.editorMode !== 'edit') {
        return !![
          editor.matricula,
          editor.nombres,
          editor.alias,
          editor.apellidos,
          editor.grupo_id,
          editor.notas_internas
        ].some((value) => String(value || '').trim()) || String(editor.estatus || 'activo').trim() !== 'activo';
      }
      const alumno = getAlumnoById(state.alumnosUi.selectedAlumnoId);
      if (!alumno) return false;
      const split = splitAlumnoNombreCompleto(alumno.nombre_completo || '');
      const fullName = composeAlumnoNombreCompleto(editor.nombres, editor.apellidos);
      const nextAlias = composeAlumnoNombreMostrado(editor.nombres, editor.alias, fullName);
      return String(editor.matricula || '').trim() !== String(alumno.matricula || '').trim() ||
        fullName !== String(alumno.nombre_completo || '').trim() ||
        nextAlias !== String(alumno.nombre_mostrado || alumno.nombre_completo || '').trim() ||
        String(editor.grupo_id || '').trim() !== String(alumno.grupo_id || '').trim() ||
        String(editor.estatus || 'activo').trim() !== String(alumno.estatus || 'activo').trim() ||
        String(editor.notas_internas || '').trim() !== String(getAlumnoAdminNotes(alumno.alumno_id, alumno.notas_internas || '') || '').trim() ||
        String(editor.nombres || '').trim() !== String(split.nombres || alumno.nombre_mostrado || '').trim() ||
        String(editor.apellidos || '').trim() !== String(split.apellidos || '').trim();
    }

    function isAlumnoCambioGrupoDirty() {
      if (!state.alumnosUi || !state.alumnosUi.cambioGrupoOpen) return false;
      const cambio = state.alumnosUi.cambioGrupo || createEmptyAlumnoCambioState();
      return !!String(cambio.nuevo_grupo_id || '').trim() || !!String(cambio.motivo || '').trim();
    }

    function shouldIgnoreAlumnoPanelOutsideClick(target) {
      if (!target || !target.closest) return false;
      if (target.closest('#adminAlumnoEditor, #adminAlumnoCambioGrupo, #adminAlumnoHistorial')) return true;
      if (target.closest('#adminAlumnoNewBtn')) return true;
      const opener = target.closest('button');
      const inlineAction = opener ? String(opener.getAttribute('onclick') || '') : '';
      return /openAlumnoEditor|openCambioGrupo|openAlumnoHistorial/.test(inlineAction);
    }

    function handleAlumnoPanelOutsideClick(event) {
      if (!canUseAdminShell() || state.activeAdminModule !== 'alumnos' || !state.alumnosUi) return;
      const hasOpenPanel = state.alumnosUi.editorOpen || state.alumnosUi.cambioGrupoOpen || state.alumnosUi.historialOpen;
      if (!hasOpenPanel || shouldIgnoreAlumnoPanelOutsideClick(event.target)) return;
      const canCloseEditor = !state.alumnosUi.editorOpen || !isAlumnoEditorDirty();
      const canCloseCambio = !state.alumnosUi.cambioGrupoOpen || !isAlumnoCambioGrupoDirty();
      if (!canCloseEditor || !canCloseCambio) return;
      closeAlumnoEditor();
      closeCambioGrupo();
      closeAlumnoHistorial();
      renderAdminAlumnosModule();
    }

    function invalidateAlumnoHistorialCache(alumnoId) {
      const id = String(alumnoId || '').trim();
      if (!id || !state.alumnosUi) return;
      delete state.alumnosUi.remoteHistoryByAlumno[id];
      delete state.alumnosUi.remoteHistoryLoadedByAlumno[id];
      delete state.alumnosUi.remoteHistoryFailedByAlumno[id];
    }

    async function loadAlumnoHistorialRemoto(alumnoId) {
      const id = String(alumnoId || '').trim();
      if (!id || !canUseAdminShell()) return;
      try {
        const response = await api('getHistorialAlumno', { alumno_id: id });
        const remoteRows = Array.isArray(response && response.historial) ? response.historial : [];
        state.alumnosUi.remoteHistoryByAlumno[id] = remoteRows.map((row, index) => ({
          entry_id: String(row.entry_id || ('remote-' + id + '-' + index)),
          tipo: String(row.tipo || 'evento'),
          titulo: String(row.titulo || 'Movimiento'),
          detalle: String(row.detalle || ''),
          fecha: row.fecha || ''
        }));
        state.alumnosUi.remoteHistoryLoadedByAlumno[id] = true;
        state.alumnosUi.remoteHistoryFailedByAlumno[id] = false;
      } catch (error) {
        state.alumnosUi.remoteHistoryFailedByAlumno[id] = true;
        console.warn('No se pudo cargar historial remoto de alumno:', error);
      }
      if (state.alumnosUi.historialOpen && state.alumnosUi.historialAlumnoId === id) {
        renderAlumnoHistorial();
      }
    }

    function syncAdminAlumnosModule() {
      if (!canUseAdminShell()) return;
      if (state.activeAdminModule !== 'alumnos') {
        closeAlumnoEditor();
        closeCambioGrupo();
        closeAlumnoHistorial();
      }
    }

    function openAlumnoEditor(mode, alumnoId) {
      const alumno = mode === 'edit' ? getAlumnoById(alumnoId) : null;
      const split = splitAlumnoNombreCompleto(alumno ? alumno.nombre_completo : '');
      state.alumnosUi.editorMode = mode === 'edit' ? 'edit' : 'new';
      state.alumnosUi.selectedAlumnoId = alumno ? alumno.alumno_id : '';
      state.alumnosUi.editor = alumno ? {
        alumno_id: alumno.alumno_id,
        matricula: alumno.matricula || '',
        nombres: split.nombres || alumno.nombre_mostrado || '',
        alias: alumno.nombre_mostrado || '',
        aliasTouched: !!String(alumno.nombre_mostrado || '').trim(),
        apellidos: split.apellidos || '',
        grupo_id: alumno.grupo_id || '',
        estatus: alumno.estatus || 'activo',
        notas_internas: getAlumnoAdminNotes(alumno.alumno_id, alumno.notas_internas || '')
      } : createEmptyAlumnoEditorState();
      if (!alumno) syncAlumnoAliasSuggestion({ force: true });
      state.alumnosUi.editorOpen = true;
      closeCambioGrupo();
      closeAlumnoHistorial();
      renderAdminAlumnosModule();
    }

    async function saveAlumnoEditor(button) {
      const editor = state.alumnosUi.editor || createEmptyAlumnoEditorState();
      const fullName = composeAlumnoNombreCompleto(editor.nombres, editor.apellidos);
      const editing = state.alumnosUi.editorMode === 'edit';
      const existingId = editing ? state.alumnosUi.selectedAlumnoId : '';
      const existingAlumno = editing ? getAlumnoById(existingId) : null;
      const previousStatus = existingAlumno ? getAlumnoStatusVisual(existingAlumno) : 'activo';
      const nextStatus = getAlumnoStatusVisual({ estatus: String(editor.estatus || 'activo').trim() });
      await handleAction('guardarAlumno', async () => {
        ensureLoggedIn();
        if (!String(editor.matricula || '').trim()) throw new Error('Captura la matr\u00edcula del alumno.');
        if (!fullName) throw new Error('Captura el nombre del alumno.');
        if (!String(editor.grupo_id || '').trim()) throw new Error('Selecciona el grupo actual.');
        if (editing && previousStatus === 'activo' && nextStatus === 'pausa' && !confirm('El alumno pasar\u00e1 a pausa y seguir\u00e1 visible dentro del cat\u00e1logo administrativo.')) return;
        const statusNote = editing && previousStatus !== nextStatus
          ? requestAlumnoStatusHistoryNote(existingAlumno, String(editor.estatus || 'activo').trim(), 'Cambio desde ficha')
          : '';
        if (editing && previousStatus !== nextStatus && statusNote === null) return;
        const payload = {
          alumno_id: existingId,
          matricula: String(editor.matricula || '').trim(),
          nombre_completo: fullName,
          nombre_mostrado: composeAlumnoNombreMostrado(editor.nombres, editor.alias, fullName),
          grupo_id: String(editor.grupo_id || '').trim(),
          estatus: String(editor.estatus || 'activo').trim(),
          notas_internas: String(editor.notas_internas || '').trim()
        };
        if (statusNote) payload.motivo = statusNote;
        const response = await api('guardarAlumno', payload);
        const savedId = (response && response.alumno_id) || existingId || '';
        const savedAlumno = response && response.alumno ? response.alumno : null;
        if (savedId) {
          state.alumnosUi.notesByAlumno[savedId] = String(editor.notas_internas || '').trim();
          bumpAlumnosSourceRevision();
          if (savedAlumno) applySavedAlumnoCatalogRow(savedAlumno);
          pushAlumnoHistory(
            savedId,
            editing ? 'edicion' : 'alta',
            editing ? 'Ficha actualizada' : 'Alta de alumno',
            editing ? buildAlumnoFichaHistoryDetail(existingAlumno, payload, statusNote) : 'Se agreg\u00f3 un nuevo alumno al cat\u00e1logo.',
            new Date().toISOString()
          );
          invalidateAlumnoHistorialCache(savedId);
        }
        closeAlumnoEditor();
        renderAdminModuleSurface('alumnos');
        setBanner(editing ? 'Ficha actualizada.' : 'Alumno creado.', 'success');
      }, {
        button,
        key: buildActionKey('guardarAlumno', [existingId || editor.matricula, editor.grupo_id]),
        busyText: button ? button.textContent : 'Guardar'
      });
    }

    function openCambioGrupo(alumnoId) {
      const alumno = getAlumnoById(alumnoId);
      if (!alumno) return;
      state.alumnosUi.cambioGrupoOpen = true;
      state.alumnosUi.cambioGrupo = {
        alumno_id: alumno.alumno_id,
        nuevo_grupo_id: '',
        motivo: ''
      };
      closeAlumnoEditor();
      closeAlumnoHistorial();
      renderAdminAlumnosModule();
    }

    async function updateAlumnoStatus(alumnoId, nextStatus, button, options) {
      ensureLoggedIn();
      const alumno = getAlumnoById(alumnoId);
      if (!alumno) throw new Error('No se encontr\u00f3 el alumno seleccionado.');
      const currentStatus = getAlumnoStatusVisual(alumno);
      const targetStatus = String(nextStatus || '').trim().toLowerCase();
      const meta = Object.assign({
        confirmText: '',
        actionKey: 'guardarAlumno:estatus',
        historyType: targetStatus || 'estado',
        historyTitle: 'Estado actualizado',
        historyDetail: 'Se actualiz\u00f3 el estatus del alumno.',
        successMessage: 'Estatus actualizado.'
      }, options || {});
      if (meta.confirmText && !confirm(meta.confirmText)) return;
      const statusNote = requestAlumnoStatusHistoryNote(alumno, targetStatus, meta.historyTitle);
      if (statusNote === null) return;
      await handleAction(meta.actionKey, async () => {
        await api('guardarAlumno', {
          alumno_id: alumno.alumno_id,
          matricula: alumno.matricula,
          nombre_completo: alumno.nombre_completo,
          nombre_mostrado: alumno.nombre_mostrado || alumno.nombre_completo,
          grupo_id: alumno.grupo_id,
          estatus: targetStatus,
          motivo: statusNote
        });
        applyPatchedAlumnoCatalogRow(alumno.alumno_id, {
          estatus: targetStatus,
          fecha_baja: targetStatus === 'activo' ? '' : (alumno.fecha_baja || ''),
          archivado_at: targetStatus === 'activo' ? '' : (alumno.archivado_at || ''),
          archivado_por: targetStatus === 'activo' ? '' : (alumno.archivado_por || '')
        });
        if (currentStatus === 'archivado' && targetStatus !== 'baja') {
          delete state.alumnosUi.archivedShadow[alumno.alumno_id];
          bumpAlumnosSourceRevision();
        }
        if (targetStatus === 'baja') {
          state.alumnosUi.archivedShadow[alumno.alumno_id] = Object.assign({}, alumno, {
            estatus: 'baja',
            __archived: true,
            fecha_baja: getTodayYmdLocal(),
            archivado_at: new Date().toISOString()
          });
          bumpAlumnosSourceRevision();
        }
        pushAlumnoHistory(alumno.alumno_id, meta.historyType, meta.historyTitle, buildAlumnoStatusHistoryDetail(meta.historyDetail, statusNote), new Date().toISOString());
        invalidateAlumnoHistorialCache(alumno.alumno_id);
        if (state.alumnosUi.selectedAlumnoId === alumno.alumno_id) closeAlumnoEditor();
        renderAdminModuleSurface('alumnos');
        setBanner(meta.successMessage, 'success');
      }, { button, key: buildActionKey(meta.actionKey, [alumno.alumno_id, targetStatus]), busyText: button ? button.textContent : meta.historyTitle });
    }

    function pauseAlumno(alumnoId, button) {
      return updateAlumnoStatus(alumnoId, 'pausa', button, {
        confirmText: 'El alumno quedar\u00e1 en pausa y seguir\u00e1 visible dentro del cat\u00e1logo administrativo.',
        actionKey: 'guardarAlumno:pausa',
        historyType: 'pausa',
        historyTitle: 'Alumno en pausa',
        historyDetail: 'Se paus\u00f3 temporalmente al alumno dentro del cat\u00e1logo.',
        successMessage: 'Alumno en pausa.'
      });
    }

    async function confirmCambioGrupo(button) {
      ensureLoggedIn();
      const cambio = state.alumnosUi.cambioGrupo || createEmptyAlumnoCambioState();
      const alumno = getAlumnoById(cambio.alumno_id);
      if (!alumno) throw new Error('No se encontr\u00f3 el alumno seleccionado.');
      if (!String(cambio.nuevo_grupo_id || '').trim()) throw new Error('Selecciona el nuevo grupo.');
      if (String(cambio.nuevo_grupo_id || '').trim() === String(alumno.grupo_id || '').trim()) {
        throw new Error('Selecciona un grupo diferente al actual.');
      }
      await handleAction('guardarAlumno:cambioGrupo', async () => {
        await api('guardarAlumno', {
          alumno_id: alumno.alumno_id,
          matricula: alumno.matricula,
          nombre_completo: alumno.nombre_completo,
          nombre_mostrado: alumno.nombre_mostrado || alumno.nombre_completo,
          grupo_id: cambio.nuevo_grupo_id,
          estatus: alumno.estatus || 'activo',
          motivo: String(cambio.motivo || '').trim()
        });
        applyPatchedAlumnoCatalogRow(alumno.alumno_id, {
          grupo_id: cambio.nuevo_grupo_id
        });
        pushAlumnoHistory(
          alumno.alumno_id,
          'grupo',
          'Cambio de grupo',
          'De ' + getGrupoNombre(alumno.grupo_id) + ' a ' + getGrupoNombre(cambio.nuevo_grupo_id) + (String(cambio.motivo || '').trim() ? ' \u00b7 ' + String(cambio.motivo || '').trim() : ''),
          new Date().toISOString()
        );
        invalidateAlumnoHistorialCache(alumno.alumno_id);
        closeCambioGrupo();
        renderAdminModuleSurface('alumnos');
        setBanner('Grupo actualizado.', 'success');
      }, {
        button,
        key: buildActionKey('guardarAlumno:cambioGrupo', [alumno.alumno_id, cambio.nuevo_grupo_id]),
        busyText: button ? button.textContent : 'Confirmar cambio'
      });
    }

    async function archiveAlumno(alumnoId, button) {
      ensureLoggedIn();
      const alumno = getAlumnoById(alumnoId);
      if (alumno && getAlumnoStatusVisual(alumno) === 'activo') {
        throw new Error('Primero pausa o cambia el estatus del alumno antes de archivarlo.');
      }
      if (!alumno) throw new Error('No se encontr\u00f3 el alumno seleccionado.');
      if (!confirm('El alumno pasar\u00e1 a archivados y saldr\u00e1 de las vistas activas.')) return;
      const statusNote = requestAlumnoStatusHistoryNote(alumno, 'baja', 'Archivar alumno');
      if (statusNote === null) return;
      await handleAction('archivarAlumno', async () => {
        await api('archivarAlumno', { alumno_id: alumno.alumno_id, motivo: statusNote });
        const archivedAt = new Date().toISOString();
        applyPatchedAlumnoCatalogRow(alumno.alumno_id, {
          estatus: 'baja',
          fecha_baja: getTodayYmdLocal(),
          archivado_at: archivedAt,
          archivado_por: String(state.session && state.session.usuario && state.session.usuario.facilitador_id || '')
        });
        state.alumnosUi.archivedShadow[alumno.alumno_id] = Object.assign({}, alumno, {
          estatus: 'baja',
          __archived: true,
          fecha_baja: getTodayYmdLocal(),
          archivado_at: archivedAt
        });
        bumpAlumnosSourceRevision();
        pushAlumnoHistory(alumno.alumno_id, 'archivado', 'Alumno archivado', buildAlumnoStatusHistoryDetail('Se retir\u00f3 del listado activo del cat\u00e1logo.', statusNote), new Date().toISOString());
        invalidateAlumnoHistorialCache(alumno.alumno_id);
        if (state.alumnosUi.selectedAlumnoId === alumno.alumno_id) closeAlumnoEditor();
        closeCambioGrupo();
        renderAdminModuleSurface('alumnos');
        setBanner('Alumno archivado.', 'success', { anchor: null });
      }, { button, key: buildActionKey('archivarAlumno', [alumno.alumno_id]), busyText: button ? button.textContent : 'Archivar' });
    }

    function getAlumnoDeleteControlState() {
      if (!state.alumnosUi) state.alumnosUi = createEmptyAlumnosUiState();
      if (!state.alumnosUi.deleteControl) state.alumnosUi.deleteControl = createEmptyAlumnoDeleteState();
      return state.alumnosUi.deleteControl;
    }

    function parseAlumnoDeleteIdsText(value) {
      return String(value || '')
        .split(/[\s,;]+/)
        .map((item) => item.trim())
        .filter(Boolean)
        .filter((item, index, arr) => arr.indexOf(item) === index);
    }

    function fallbackCopyText(text) {
      const textarea = document.createElement('textarea');
      textarea.value = String(text || '');
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      const copied = document.execCommand('copy');
      textarea.remove();
      if (!copied) throw new Error('No se pudo copiar el ID.');
    }

    async function copyAlumnoId(alumnoId, button) {
      const id = String(alumnoId || '').trim();
      if (!id) throw new Error('No hay alumno_id para copiar.');
      const originalText = button ? button.textContent : '';
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(id);
        } else {
          fallbackCopyText(id);
        }
        if (button) {
          button.textContent = 'Copiado';
          window.setTimeout(() => {
            if (button) button.textContent = originalText || 'Copiar ID';
          }, 1200);
        }
        setBanner('ID de alumno copiado.', 'success');
      } catch (err) {
        fallbackCopyText(id);
        setBanner('ID de alumno copiado.', 'success');
      }
    }

    function toggleAlumnoDeleteControl(forceExpanded) {
      const control = getAlumnoDeleteControlState();
      control.expanded = typeof forceExpanded === 'boolean' ? forceExpanded : !control.expanded;
      renderAdminAlumnosModule();
      if (control.expanded) {
        window.setTimeout(() => {
          const panel = $('adminAlumnoDeleteControl');
          if (panel && typeof panel.scrollIntoView === 'function') {
            panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }, 40);
      }
    }

    function formatAlumnoDeleteRowsBySheet(rowsBySheet) {
      const rows = rowsBySheet && typeof rowsBySheet === 'object' ? rowsBySheet : {};
      const labels = {
        ALUMNOS: 'Alumnos',
        PLANEACION_ALUMNOS: 'Relación con planeaciones',
        OBS_ALUMNO: 'Observaciones de alumno',
        ALERTAS: 'Alertas',
        EVALUACIONES: 'Evaluaciones',
        ALUMNO_TALLER: 'Talleres',
        ALUMNO_REFUERZO: 'Refuerzos',
        NOTAS_DIRECTORA: 'Notas dirección',
        REPORTES_CACHE: 'Reportes'
      };
      return Object.keys(labels)
        .filter((key) => Number(rows[key] || 0) > 0)
        .map((key) => '<div class="admin-alumnos-readonly"><span>' + escapeHtml(labels[key]) + '</span><strong>' + escapeHtml(String(rows[key] || 0)) + '</strong></div>')
        .join('');
    }

    function removeDeletedAlumnosFromClient(alumnoIds) {
      const ids = new Set((alumnoIds || []).map((id) => String(id || '').trim()).filter(Boolean));
      if (!ids.size) return;
      if (Array.isArray(state.catalogos.alumnos)) {
        state.catalogos.alumnos = state.catalogos.alumnos.filter((row) => !ids.has(String(row.alumno_id || '').trim()));
      }
      ids.forEach((id) => {
        delete state.alumnosUi.archivedShadow[id];
        delete state.alumnosUi.remoteHistoryByAlumno[id];
        delete state.alumnosUi.remoteHistoryLoadedByAlumno[id];
        delete state.alumnosUi.remoteHistoryFailedByAlumno[id];
        delete state.alumnosUi.historyByAlumno[id];
        delete state.alumnosUi.notesByAlumno[id];
      });
      if (ids.has(String(state.alumnosUi.selectedAlumnoId || '').trim())) closeAlumnoEditor();
      if (ids.has(String(state.alumnosUi.historialAlumnoId || '').trim())) closeAlumnoHistorial();
      if (ids.has(String(state.alumnosUi.cambioGrupo && state.alumnosUi.cambioGrupo.alumno_id || '').trim())) closeCambioGrupo();
      bumpAlumnosSourceRevision();
    }

    function renderAlumnoDeletePreview() {
      const previewHost = $('adminAlumnoDeletePreview');
      if (!previewHost) return;
      const control = getAlumnoDeleteControlState();
      const preview = control.preview;
      const result = control.lastResult;
      const data = result || preview;
      if (!data) {
        previewHost.innerHTML = '<div class="admin-alumnos-empty" style="min-height:120px;"><div><strong>Sin vista previa.</strong><div class="subtle">Escribe uno o varios alumno_id para revisar el impacto antes de borrar.</div></div></div>';
        return;
      }
      const isDeleteResult = !!(result && Array.isArray(result.deleted_alumno_ids));
      const sourceData = isDeleteResult && result.before_preview ? result.before_preview : data;
      const alumnos = Array.isArray(sourceData.alumnos) ? sourceData.alumnos : [];
      const missing = !isDeleteResult && Array.isArray(sourceData.missing_alumno_ids) ? sourceData.missing_alumno_ids : [];
      const affectedPlans = Array.isArray(sourceData.planeaciones_afectadas) ? sourceData.planeaciones_afectadas : [];
      const emptyPlans = Array.isArray(sourceData.planeaciones_que_quedan_sin_alumnos) ? sourceData.planeaciones_que_quedan_sin_alumnos : [];
      const deletedRows = result && result.deleted_rows ? result.deleted_rows : null;
      const rowsBySheet = deletedRows || sourceData.rows_by_sheet || {};
      const reportFiles = sourceData.report_files || {};
      const totalRows = Number(sourceData.total_rows || Object.values(rowsBySheet).reduce((sum, count) => sum + Number(count || 0), 0));
      const deletedAlumnoIds = Array.isArray(result && result.deleted_alumno_ids) ? result.deleted_alumno_ids : [];
      const alumnoCountLabel = isDeleteResult ? 'Alumnos eliminados' : 'Alumnos encontrados';
      const alumnoCountValue = isDeleteResult ? (deletedAlumnoIds.length || alumnos.length || 0) : alumnos.length;
      const resultSummary = isDeleteResult
        ? '<div class="admin-alumnos-result"><strong>Borrado completado</strong><div>' + escapeHtml(String(alumnoCountValue)) + ' alumno(s) eliminado(s) · ' + escapeHtml(String(totalRows)) + ' fila(s) eliminada(s).</div></div>'
        : '';
      const planeacionRows = affectedPlans.length
        ? affectedPlans.slice(0, 8).map((plan) => {
            const materia = plan.materia_nombre || plan.materia_id || 'Sin materia';
            return '<div class="admin-alumnos-readonly"><span>' + escapeHtml(plan.planeacion_id || '-') + '</span><strong>' + escapeHtml(materia + ' · ' + (plan.alumnos_antes || 0) + ' -> ' + (plan.alumnos_despues || 0)) + '</strong></div>';
          }).join('')
        : '<div class="admin-alumnos-empty" style="min-height:88px;"><div><strong>Sin planeaciones afectadas.</strong></div></div>';
      previewHost.innerHTML = [
        resultSummary,
        '<div class="admin-alumnos-mini-grid">',
          '<div class="admin-alumnos-readonly"><span>' + alumnoCountLabel + '</span><strong>' + escapeHtml(String(alumnoCountValue || 0)) + '</strong></div>',
          '<div class="admin-alumnos-readonly"><span>Filas afectadas</span><strong>' + escapeHtml(String(totalRows || 0)) + '</strong></div>',
          '<div class="admin-alumnos-readonly"><span>Planeaciones afectadas</span><strong>' + escapeHtml(String(affectedPlans.length || 0)) + '</strong></div>',
          '<div class="admin-alumnos-readonly"><span>Quedan sin alumnos</span><strong>' + escapeHtml(String(emptyPlans.length || 0)) + '</strong></div>',
        '</div>',
        missing.length ? '<div class="admin-config-danger"><strong>No encontrados:</strong> ' + escapeHtml(missing.join(', ')) + '</div>' : '',
        '<div class="admin-alumnos-mini-grid">' + (formatAlumnoDeleteRowsBySheet(rowsBySheet) || '<div class="admin-alumnos-readonly"><span>Registros asociados</span><strong>0</strong></div>') + '</div>',
        '<div class="admin-alumnos-mini-grid">',
          '<div class="admin-alumnos-readonly"><span>PDFs de reporte</span><strong>' + escapeHtml(String(reportFiles.pdf_files || 0)) + '</strong></div>',
          '<div class="admin-alumnos-readonly"><span>Docs de reporte</span><strong>' + escapeHtml(String(reportFiles.doc_files || 0)) + '</strong></div>',
        '</div>',
        '<div class="admin-alumnos-section-head"><div><h4>Planeaciones</h4><div class="subtle">Se conserva la planeación; solo se retira el alumno y se recalcula el conteo.</div></div></div>',
        '<div class="admin-alumnos-mini-grid">' + planeacionRows + '</div>'
      ].join('');
    }

    async function previewAlumnoDeleteControl(button) {
      ensureLoggedIn();
      const control = getAlumnoDeleteControlState();
      const ids = parseAlumnoDeleteIdsText(control.idsText);
      await handleAction('previewBorradoAlumnos', async () => {
        if (!ids.length) throw new Error('Escribe al menos un alumno_id.');
        const preview = await api('previewBorradoAlumnos', { alumno_ids: ids });
        control.preview = preview;
        control.previewIds = ids.slice();
        control.lastResult = null;
        control.confirmationText = '';
        renderAdminAlumnosModule();
      }, { button, key: buildActionKey('previewBorradoAlumnos', ids), busyText: 'Revisando' });
    }

    async function executeAlumnoDeleteControl(button) {
      ensureLoggedIn();
      const control = getAlumnoDeleteControlState();
      const ids = parseAlumnoDeleteIdsText(control.idsText);
      await handleAction('borrarAlumnosControlado', async () => {
        const previewIds = Array.isArray(control.previewIds) ? control.previewIds : [];
        const samePreviewIds = ids.length === previewIds.length && ids.every((id, index) => id === previewIds[index]);
        if (!ids.length) throw new Error('Escribe al menos un alumno_id.');
        if (String(control.confirmationText || '').trim() !== 'BORRAR_ALUMNOS') {
          throw new Error('Escribe BORRAR_ALUMNOS para confirmar.');
        }
        if (!control.preview || !Array.isArray(control.preview.alumnos) || !control.preview.alumnos.length) {
          throw new Error('Primero genera una vista previa con alumnos existentes.');
        }
        if (!samePreviewIds) {
          throw new Error('Actualiza la vista previa antes de borrar. Los IDs cambiaron.');
        }
        if (!confirm('Se borrar\u00e1n por completo los alumnos encontrados y sus datos asociados. Esta acci\u00f3n no se puede deshacer desde la app.')) return;
        const result = await api('borrarAlumnosControlado', {
          alumno_ids: ids,
          confirmation_code: 'BORRAR_ALUMNOS',
          trash_report_files: !!control.trashReportFiles
        });
        control.lastResult = result;
        control.preview = result.before_preview || control.preview;
        control.confirmationText = '';
        removeDeletedAlumnosFromClient(result.deleted_alumno_ids || ids);
        renderAdminModuleSurface('alumnos');
        setBanner('Borrado controlado completado.', 'success', { anchor: null });
      }, { button, key: buildActionKey('borrarAlumnosControlado', ids), busyText: 'Borrando' });
    }

    async function reactivateAlumno(alumnoId, button) {
      ensureLoggedIn();
      const alumno = getAlumnoById(alumnoId);
      if (!alumno) throw new Error('No se encontr\u00f3 el alumno seleccionado.');
      if (!String(alumno.grupo_id || '').trim()) {
        openCambioGrupo(alumnoId);
        setBanner('Selecciona primero un grupo para reactivar al alumno.', 'info');
        return;
      }
      return updateAlumnoStatus(alumnoId, 'activo', button, {
        confirmText: 'El alumno volver\u00e1 al cat\u00e1logo activo.',
        actionKey: 'reactivarAlumno',
        historyType: 'reactivado',
        historyTitle: 'Alumno reactivado',
        historyDetail: 'Se devolvi\u00f3 al alumno al cat\u00e1logo activo.',
        successMessage: 'Alumno reactivado.'
      });
    }

    function openAlumnoHistorial(alumnoId) {
      const alumno = getAlumnoById(alumnoId);
      if (!alumno) return;
      state.alumnosUi.historialOpen = true;
      state.alumnosUi.historialAlumnoId = alumno.alumno_id;
      closeAlumnoEditor();
      closeCambioGrupo();
      renderAdminAlumnosModule();
      loadAlumnoHistorialRemoto(alumno.alumno_id);
    }

    function buildAlumnoQuickActionsMarkup(alumno) {
      if (!alumno) return '';
      const visualStatus = getAlumnoStatusVisual(alumno);
      const buttons = [
        '<button class="btn-ghost" type="button" onclick="copyAlumnoId(\'' + escapeJsAttrValue(alumno.alumno_id) + '\', this)">Copiar ID</button>',
        '<button class="btn-ghost" type="button" onclick="openAlumnoHistorial(\'' + escapeJsAttrValue(alumno.alumno_id) + '\')">Ver historial</button>'
      ];
      if (visualStatus === 'activo') {
        buttons.unshift('<button class="btn-secondary" type="button" onclick="openCambioGrupo(\'' + escapeJsAttrValue(alumno.alumno_id) + '\')">Cambiar grupo</button>');
        buttons.push('<button class="btn-accent" type="button" onclick="pauseAlumno(\'' + escapeJsAttrValue(alumno.alumno_id) + '\', this)">Pausar</button>');
      } else if (visualStatus === 'pausa' || visualStatus === 'inactivo') {
        buttons.unshift('<button class="btn-primary" type="button" onclick="reactivateAlumno(\'' + escapeJsAttrValue(alumno.alumno_id) + '\', this)">Reactivar</button>');
        buttons.push('<button class="btn-accent" type="button" onclick="archiveAlumno(\'' + escapeJsAttrValue(alumno.alumno_id) + '\', this)">Archivar</button>');
      } else if (visualStatus === 'egresado') {
        buttons.push('<button class="btn-accent" type="button" onclick="archiveAlumno(\'' + escapeJsAttrValue(alumno.alumno_id) + '\', this)">Archivar</button>');
      } else {
        buttons.unshift('<button class="btn-primary" type="button" onclick="reactivateAlumno(\'' + escapeJsAttrValue(alumno.alumno_id) + '\', this)">Reactivar</button>');
      }
      return buttons.join('');
    }

    function renderAlumnoEditor() {
      const editorHost = $('adminAlumnoEditor');
      if (!editorHost) return;
      editorHost.hidden = !state.alumnosUi.editorOpen;
      if (editorHost.hidden) return;
      const selectedAlumno = state.alumnosUi.editorMode === 'edit'
        ? getAlumnoById(state.alumnosUi.selectedAlumnoId)
        : null;
      if ($('adminAlumnoEditorTitle')) $('adminAlumnoEditorTitle').textContent = state.alumnosUi.editorMode === 'edit' ? 'Editar ficha' : 'Nuevo alumno';
      if ($('adminAlumnoMatricula')) $('adminAlumnoMatricula').value = state.alumnosUi.editor.matricula || '';
      if ($('adminAlumnoNombres')) $('adminAlumnoNombres').value = state.alumnosUi.editor.nombres || '';
      if ($('adminAlumnoAlias')) $('adminAlumnoAlias').value = state.alumnosUi.editor.alias || '';
      if ($('adminAlumnoApellidos')) $('adminAlumnoApellidos').value = state.alumnosUi.editor.apellidos || '';
      if ($('adminAlumnoStatus')) $('adminAlumnoStatus').value = state.alumnosUi.editor.estatus || 'activo';
      if ($('adminAlumnoNotas')) $('adminAlumnoNotas').value = state.alumnosUi.editor.notas_internas || '';
      fillSelect($('adminAlumnoGrupo'), state.catalogos.grupos || [], (row) => row.grupo_id, (row) => getGrupoDisplayName(row), 'Selecciona grupo');
      if ($('adminAlumnoGrupo')) $('adminAlumnoGrupo').value = state.alumnosUi.editor.grupo_id || '';
      if ($('adminAlumnoIdentity')) {
        $('adminAlumnoIdentity').hidden = !selectedAlumno;
        $('adminAlumnoIdentity').innerHTML = selectedAlumno
          ? [
              '<div class="admin-alumnos-readonly"><span>Alumno ID</span><strong title="' + escapeHtml(selectedAlumno.alumno_id || '') + '">' + escapeHtml(getAlumnoCompactId(selectedAlumno) || '-') + '</strong></div>',
              '<div class="admin-alumnos-readonly"><span>Matr&iacute;cula</span><strong>' + escapeHtml(formatAlumnoCompactId(selectedAlumno.matricula) || '-') + '</strong></div>'
            ].join('')
          : '';
      }
      if ($('adminAlumnoQuickActions')) {
        $('adminAlumnoQuickActions').hidden = !selectedAlumno;
        $('adminAlumnoQuickActions').innerHTML = selectedAlumno ? buildAlumnoQuickActionsMarkup(selectedAlumno) : '';
      }
    }

    function renderAlumnoCambioGrupo() {
      const panel = $('adminAlumnoCambioGrupo');
      if (!panel) return;
      panel.hidden = !state.alumnosUi.cambioGrupoOpen;
      if (panel.hidden) return;
      const alumno = getAlumnoById(state.alumnosUi.cambioGrupo.alumno_id);
      if ($('adminAlumnoCambioMatricula')) $('adminAlumnoCambioMatricula').textContent = alumno ? getAlumnoSecondaryLabel(alumno) : '-';
      if ($('adminAlumnoCambioNombre')) $('adminAlumnoCambioNombre').textContent = alumno ? getAlumnoNameLabel(alumno) : '-';
      if ($('adminAlumnoCambioGrupoActual')) $('adminAlumnoCambioGrupoActual').textContent = alumno ? getGrupoNombre(alumno.grupo_id) : '-';
      fillSelect($('adminAlumnoCambioGrupoNuevo'), state.catalogos.grupos || [], (row) => row.grupo_id, (row) => getGrupoDisplayName(row), 'Selecciona grupo');
      if ($('adminAlumnoCambioGrupoNuevo')) $('adminAlumnoCambioGrupoNuevo').value = state.alumnosUi.cambioGrupo.nuevo_grupo_id || '';
      if ($('adminAlumnoCambioMotivo')) $('adminAlumnoCambioMotivo').value = state.alumnosUi.cambioGrupo.motivo || '';
    }

    function renderAlumnoHistorial() {
      const panel = $('adminAlumnoHistorial');
      const host = $('adminAlumnoHistorialList');
      if (!panel || !host) return;
      panel.hidden = !state.alumnosUi.historialOpen;
      if (panel.hidden) return;
      const alumnoId = String(state.alumnosUi.historialAlumnoId || '').trim();
      const alumno = getAlumnoById(state.alumnosUi.historialAlumnoId);
      const remoteLoaded = !!(state.alumnosUi.remoteHistoryLoadedByAlumno && state.alumnosUi.remoteHistoryLoadedByAlumno[alumnoId]);
      const remoteFailed = !!(state.alumnosUi.remoteHistoryFailedByAlumno && state.alumnosUi.remoteHistoryFailedByAlumno[alumnoId]);
      if ($('adminAlumnoHistorialLabel')) {
        $('adminAlumnoHistorialLabel').textContent = alumno
          ? (getAlumnoNameLabel(alumno) + ' · ID: ' + getAlumnoCompactId(alumno) + ' · ' + (formatAlumnoCompactId(alumno.matricula) || 'sin matrícula'))
          : 'Seguimiento del alumno.';
      }
      const historyFoot = $('adminAlumnoHistorial') ? $('adminAlumnoHistorial').querySelector('.admin-alumnos-history-foot') : null;
      if (historyFoot) {
        if (remoteLoaded) {
          historyFoot.textContent = 'Historial cargado desde backend.';
        } else if (remoteFailed) {
          historyFoot.textContent = 'Mostrando respaldo local porque el historial remoto no estuvo disponible.';
        } else {
          historyFoot.textContent = 'Cargando historial desde backend...';
        }
      }
      const rows = getAlumnoHistorial(state.alumnosUi.historialAlumnoId);
      if (!rows.length) {
        host.innerHTML = '<div class="admin-alumnos-empty">Todav&iacute;a no hay movimientos registrados para este alumno.</div>';
        return;
      }
      host.innerHTML = rows.map((row) => {
        const ymd = toYmdFrontend_(row.fecha || '');
        return '<article class="admin-alumnos-history-item">' +
          '<strong>' + escapeHtml(row.titulo || 'Movimiento') + '</strong>' +
          '<div class="mini">' + escapeHtml(row.detalle || '') + '</div>' +
          '<div class="mini">' + escapeHtml(ymd ? formatFechaHumana(ymd) : 'Sin fecha') + '</div>' +
        '</article>';
      }).join('');
    }

    function renderAlumnoDeleteControl() {
      const panel = $('adminAlumnoDeleteControl');
      if (!panel) return;
      const control = getAlumnoDeleteControlState();
      panel.hidden = getCurrentRole() !== 'admin' || !control.expanded;
      if (panel.hidden) return;
      if ($('adminAlumnoDeleteIds')) $('adminAlumnoDeleteIds').value = control.idsText || '';
      if ($('adminAlumnoDeleteConfirm')) $('adminAlumnoDeleteConfirm').value = control.confirmationText || '';
      if ($('adminAlumnoDeleteTrashFiles')) $('adminAlumnoDeleteTrashFiles').checked = control.trashReportFiles !== false;
      renderAlumnoDeletePreview();
    }

    function renderAdminAlumnosList() {
      const host = $('adminAlumnosList');
      if (!host) return;
      const rows = getVisibleAlumnos();
      if ($('adminAlumnosListTitle')) $('adminAlumnosListTitle').textContent = getAlumnoListTitle();
      if ($('adminAlumnosListMeta')) $('adminAlumnosListMeta').textContent = rows.length ? (rows.length + ' alumno(s) visibles en esta vista.') : 'No hay resultados con los filtros actuales.';
      if (!rows.length) {
        host.innerHTML = '<div class="admin-alumnos-empty"><div><strong>No hay alumnos para mostrar.</strong><br><span class="subtle">Ajusta los filtros o crea un nuevo registro.</span></div></div>';
        return;
      }
      host.innerHTML = '<div class="admin-alumnos-table">' +
        '<div class="admin-alumnos-list-header">' +
          '<div>Matr&iacute;cula</div>' +
          '<div>Alumno</div>' +
          '<div>Grupo actual</div>' +
          '<div>Estado</div>' +
          '<div>Alta</div>' +
          '<div>&Uacute;ltima actualizaci&oacute;n</div>' +
          '<div>Acciones</div>' +
        '</div>' +
        rows.map((row) => {
          const visualStatus = getAlumnoStatusVisual(row);
          const actions = [
            '<button class="btn-ghost" type="button" onclick="openAlumnoEditor(\'edit\', \'' + escapeJsAttrValue(row.alumno_id) + '\')">Editar</button>'
          ];
          return '<article class="admin-alumnos-row">' +
            '<div class="admin-alumnos-cell"><div class="mini">' + escapeHtml(getAlumnoSecondaryLabel(row)) + '</div></div>' +
            '<div class="admin-alumnos-title"><button class="admin-alumnos-title-btn" type="button" onclick="openAlumnoHistorial(\'' + escapeJsAttrValue(row.alumno_id) + '\')">' + escapeHtml(getAlumnoNameLabel(row)) + '</button><div class="mini" title="' + escapeHtml(row.alumno_id || '') + '">ID: ' + escapeHtml(getAlumnoCompactId(row) || '-') + '</div></div>' +
            '<div class="admin-alumnos-cell"><div class="mini">' + escapeHtml(getGrupoNombre(row.grupo_id)) + '</div></div>' +
            '<div class="admin-alumnos-cell"><span class="admin-alumnos-badge ' + getAlumnoStatusBadgeClass(visualStatus) + '">' + escapeHtml(getAlumnoStatusLabel(visualStatus)) + '</span></div>' +
            '<div class="admin-alumnos-cell"><div class="mini">' + escapeHtml(row.fecha_alta ? formatFechaHumana(row.fecha_alta) : 'Sin fecha') + '</div></div>' +
            '<div class="admin-alumnos-cell"><div class="mini">' + escapeHtml(formatAlumnoUpdatedLabel(row)) + '</div></div>' +
            '<div class="admin-alumnos-actions">' + actions.join('') + '</div>' +
          '</article>';
        }).join('') +
      '</div>';
    }

    function getAdminAlumnosModuleTemplate() {
      return [
        '<article class="admin-toolbar admin-alumnos-module">',
          '<div class="admin-toolbar-head admin-alumnos-head">',
            '<div class="admin-alumnos-head-copy">',
              '<h3>Cat&aacute;logo de alumnos</h3>',
              '<p class="subtle">Administra altas, edici&oacute;n, cambios de grupo y estatus del cat&aacute;logo escolar.</p>',
            '</div>',
            '<div class="admin-alumnos-head-actions">',
              '<label class="admin-alumnos-search" for="adminAlumnosSearch">',
                '<span>Buscar</span>',
                '<input id="adminAlumnosSearch" type="search" placeholder="Buscar por matr&iacute;cula o nombre">',
              '</label>',
              '<button id="adminAlumnoDeleteToggleBtn" class="btn-secondary" type="button">Borrado controlado</button>',
              '<button id="adminAlumnoNewBtn" class="btn-primary" type="button">Nuevo alumno</button>',
            '</div>',
          '</div>',
          '<div class="admin-alumnos-filterbar">',
            '<div class="admin-alumnos-filterchips">',
              '<button id="adminAlumnosFilterAllBtn" class="btn-ghost" type="button">Todos</button>',
              '<button id="adminAlumnosFilterActiveBtn" class="btn-ghost" type="button">Activos</button>',
              '<button id="adminAlumnosFilterPauseBtn" class="btn-ghost" type="button">Pausa</button>',
              '<button id="adminAlumnosFilterInactiveBtn" class="btn-ghost" type="button">Inactivos</button>',
              '<button id="adminAlumnosFilterGraduatedBtn" class="btn-ghost" type="button">Egresados</button>',
              '<button id="adminAlumnosFilterArchivedBtn" class="btn-ghost" type="button">Archivados</button>',
            '</div>',
            '<label class="admin-alumnos-group-filter" for="adminAlumnosGroupFilter">',
              '<span>Grupo</span>',
              '<select id="adminAlumnosGroupFilter"></select>',
            '</label>',
          '</div>',
          '<div class="admin-alumnos-layout">',
            '<section class="admin-alumnos-main">',
              '<div class="admin-alumnos-section-head">',
                '<div>',
                  '<h4 id="adminAlumnosListTitle">Alumnos activos</h4>',
                  '<div id="adminAlumnosListMeta" class="subtle">Listado del cat&aacute;logo escolar.</div>',
                '</div>',
              '</div>',
              '<div id="adminAlumnosList" class="admin-alumnos-list"></div>',
            '</section>',
            '<aside class="admin-alumnos-side">',
              '<section id="adminAlumnoEditor" class="admin-alumnos-panel" hidden>',
                '<div class="admin-alumnos-panel-head">',
                  '<div>',
                    '<h4 id="adminAlumnoEditorTitle">Nuevo alumno</h4>',
                    '<div class="subtle">Completa la ficha principal del alumno.</div>',
                  '</div>',
                '</div>',
                '<div id="adminAlumnoQuickActions" class="actions compact admin-alumnos-panel-actions" hidden></div>',
                '<div id="adminAlumnoIdentity" class="admin-alumnos-mini-grid" hidden></div>',
                '<div class="admin-alumnos-editor-grid">',
                  '<label class="field">',
                    '<span>Matr&iacute;cula</span>',
                    '<input id="adminAlumnoMatricula" type="text" maxlength="50" placeholder="Ej. A-1024">',
                  '</label>',
                  '<label class="field">',
                    '<span>Grupo actual</span>',
                    '<select id="adminAlumnoGrupo"></select>',
                  '</label>',
                  '<label class="field">',
                    '<span>Nombre(s)</span>',
                    '<input id="adminAlumnoNombres" type="text" maxlength="100" placeholder="Nombre(s)">',
                  '</label>',
                  '<label class="field">',
                    '<span>Alias visible</span>',
                    '<input id="adminAlumnoAlias" type="text" maxlength="100" placeholder="Se sugiere con primer y segundo nombre">',
                  '</label>',
                  '<label class="field">',
                    '<span>Apellidos</span>',
                    '<input id="adminAlumnoApellidos" type="text" maxlength="100" placeholder="Apellidos">',
                  '</label>',
                  '<label class="field">',
                    '<span>Estatus</span>',
                    '<select id="adminAlumnoStatus">',
                      '<option value="activo">Activo</option>',
                      '<option value="pausa">Pausa</option>',
                      '<option value="inactivo">Inactivo</option>',
                      '<option value="egresado">Egresado</option>',
                    '</select>',
                  '</label>',
                  '<label class="field admin-alumnos-field-full">',
                    '<span>Observaci&oacute;n administrativa</span>',
                    '<textarea id="adminAlumnoNotas" rows="4" placeholder="Notas internas para administraci&oacute;n"></textarea>',
                  '</label>',
                '</div>',
                '<div class="actions compact admin-alumnos-panel-actions">',
                  '<button id="adminAlumnoCancelBtn" class="btn-ghost" type="button">Cancelar</button>',
                  '<button id="adminAlumnoSaveBtn" class="btn-primary" type="button">Guardar</button>',
                '</div>',
              '</section>',
              '<section id="adminAlumnoCambioGrupo" class="admin-alumnos-panel" hidden>',
                '<div class="admin-alumnos-panel-head">',
                  '<div>',
                    '<h4>Cambiar grupo</h4>',
                    '<div class="subtle">Actualiza el grupo del alumno con un motivo opcional.</div>',
                  '</div>',
                '</div>',
                '<div class="admin-alumnos-mini-grid">',
                  '<div class="admin-alumnos-readonly">',
                    '<span>Matr&iacute;cula</span>',
                    '<strong id="adminAlumnoCambioMatricula">-</strong>',
                  '</div>',
                  '<div class="admin-alumnos-readonly">',
                    '<span>Alumno</span>',
                    '<strong id="adminAlumnoCambioNombre">-</strong>',
                  '</div>',
                  '<div class="admin-alumnos-readonly">',
                    '<span>Grupo actual</span>',
                    '<strong id="adminAlumnoCambioGrupoActual">-</strong>',
                  '</div>',
                  '<label class="field">',
                    '<span>Nuevo grupo</span>',
                    '<select id="adminAlumnoCambioGrupoNuevo"></select>',
                  '</label>',
                  '<label class="field admin-alumnos-field-full">',
                    '<span>Motivo opcional</span>',
                    '<textarea id="adminAlumnoCambioMotivo" rows="3" placeholder="Motivo del cambio"></textarea>',
                  '</label>',
                '</div>',
                '<div class="actions compact admin-alumnos-panel-actions">',
                  '<button id="adminAlumnoCambioCancelBtn" class="btn-ghost" type="button">Cancelar</button>',
                  '<button id="adminAlumnoCambioConfirmBtn" class="btn-primary" type="button">Confirmar cambio</button>',
                '</div>',
              '</section>',
              '<section id="adminAlumnoHistorial" class="admin-alumnos-panel" hidden>',
                '<div class="admin-alumnos-panel-head">',
                  '<div>',
                    '<h4>Historial del alumno</h4>',
                    '<div id="adminAlumnoHistorialLabel" class="subtle">Seguimiento del alumno.</div>',
                  '</div>',
                '</div>',
                '<div id="adminAlumnoHistorialList" class="admin-alumnos-history"></div>',
                '<div class="admin-alumnos-history-foot subtle">Espacio preparado para acceso futuro al reporte de ciclo.</div>',
                '<div class="actions compact admin-alumnos-panel-actions">',
                  '<button id="adminAlumnoHistorialCloseBtn" class="btn-ghost" type="button">Cerrar</button>',
                '</div>',
              '</section>',
              '<section id="adminAlumnoDeleteControl" class="admin-alumnos-panel" hidden>',
                '<div class="admin-alumnos-panel-head">',
                  '<div>',
                    '<h4>Borrado controlado</h4>',
                    '<div class="subtle">Solo para alumnos de prueba. Revisa impacto antes de ejecutar.</div>',
                  '</div>',
                '</div>',
                '<div class="admin-config-danger"><strong>Acci&oacute;n irreversible:</strong> borra el alumno y sus observaciones, alertas, evaluaciones, talleres, refuerzos, notas, reportes y relaci&oacute;n con planeaciones.</div>',
                '<div class="admin-alumnos-editor-grid">',
                  '<label class="field admin-alumnos-field-full">',
                    '<span>Alumno IDs</span>',
                    '<textarea id="adminAlumnoDeleteIds" rows="4" placeholder="ALU-123&#10;ALU-456"></textarea>',
                  '</label>',
                  '<label class="field admin-alumnos-field-full">',
                    '<span>Confirmaci&oacute;n</span>',
                    '<input id="adminAlumnoDeleteConfirm" type="text" placeholder="Escribe BORRAR_ALUMNOS para ejecutar">',
                  '</label>',
                  '<label class="admin-alumnos-field-full" style="display:flex;gap:10px;align-items:center;">',
                    '<input id="adminAlumnoDeleteTrashFiles" type="checkbox">',
                    '<span>Mover PDFs/DOC de reportes a papelera</span>',
                  '</label>',
                '</div>',
                '<div class="actions compact admin-alumnos-panel-actions">',
                  '<button id="adminAlumnoDeletePreviewBtn" class="btn-secondary" type="button">Vista previa</button>',
                  '<button id="adminAlumnoDeleteExecuteBtn" class="btn-danger" type="button">Borrar alumnos</button>',
                '</div>',
                '<div id="adminAlumnoDeletePreview" class="admin-alumnos-history"></div>',
              '</section>',
            '</aside>',
          '</div>',
        '</article>'
      ].join('');
    }

    function renderAdminAlumnosModule() {
      const panel = $('admin-panel-alumnos');
      if (!panel || !canUseAdminShell()) return;
      if (panel.dataset.ready !== '1') {
        panel.innerHTML = getAdminAlumnosModuleTemplate();
        panel.dataset.ready = '1';
        bindAdminAlumnosEvents();
      }
      syncAdminAlumnosModule();
      const filter = String(state.alumnosUi.filter || 'activos').trim();
      if ($('adminAlumnosSearch')) $('adminAlumnosSearch').value = state.alumnosUi.search || '';
      fillSelect($('adminAlumnosGroupFilter'), state.catalogos.grupos || [], (row) => row.grupo_id, (row) => getGrupoDisplayName(row), 'Todos los grupos');
      if ($('adminAlumnosGroupFilter')) $('adminAlumnosGroupFilter').value = state.alumnosUi.grupo || '';
      if ($('adminAlumnosFilterAllBtn')) $('adminAlumnosFilterAllBtn').classList.toggle('is-active', filter === 'todos');
      if ($('adminAlumnosFilterActiveBtn')) $('adminAlumnosFilterActiveBtn').classList.toggle('is-active', filter === 'activos');
      if ($('adminAlumnosFilterPauseBtn')) $('adminAlumnosFilterPauseBtn').classList.toggle('is-active', filter === 'pausa');
      if ($('adminAlumnosFilterInactiveBtn')) $('adminAlumnosFilterInactiveBtn').classList.toggle('is-active', filter === 'inactivos');
      if ($('adminAlumnosFilterGraduatedBtn')) $('adminAlumnosFilterGraduatedBtn').classList.toggle('is-active', filter === 'egresados');
      if ($('adminAlumnosFilterArchivedBtn')) $('adminAlumnosFilterArchivedBtn').classList.toggle('is-active', filter === 'archivados');
      const deleteControl = getAlumnoDeleteControlState();
      if ($('adminAlumnoDeleteToggleBtn')) {
        $('adminAlumnoDeleteToggleBtn').hidden = getCurrentRole() !== 'admin';
        $('adminAlumnoDeleteToggleBtn').textContent = deleteControl.expanded ? 'Ocultar borrado' : 'Borrado controlado';
        $('adminAlumnoDeleteToggleBtn').setAttribute('aria-expanded', deleteControl.expanded ? 'true' : 'false');
      }
      const headTitle = panel.querySelector('.admin-alumnos-head-copy h3');
      if (headTitle) headTitle.textContent = 'Cat\u00e1logo de alumnos';
      const headSubtitle = panel.querySelector('.admin-alumnos-head-copy .subtle');
      if (headSubtitle) headSubtitle.textContent = 'Administra altas, edici\u00f3n, cambios de grupo y estatus del cat\u00e1logo escolar.';
      if ($('adminAlumnosSearch')) $('adminAlumnosSearch').placeholder = 'Buscar por matr\u00edcula o nombre';
      const historyTitle = $('adminAlumnoHistorial') ? $('adminAlumnoHistorial').querySelector('h4') : null;
      if (historyTitle) historyTitle.textContent = 'Historial administrativo reciente';
      const historyFoot = $('adminAlumnoHistorial') ? $('adminAlumnoHistorial').querySelector('.admin-alumnos-history-foot') : null;
      if (historyFoot) historyFoot.textContent = 'El historial se mostrar\u00e1 desde backend cuando est\u00e9 disponible.';
      const matriculaLabel = $('adminAlumnoMatricula') ? $('adminAlumnoMatricula').closest('label').querySelector('span') : null;
      if (matriculaLabel) matriculaLabel.textContent = 'Matr\u00edcula';
      const notasLabel = $('adminAlumnoNotas') ? $('adminAlumnoNotas').closest('label').querySelector('span') : null;
      if (notasLabel) notasLabel.textContent = 'Observaci\u00f3n administrativa';
      if ($('adminAlumnoNotas')) $('adminAlumnoNotas').placeholder = 'Notas internas para administraci\u00f3n';
      const cambioMatriculaLabel = $('adminAlumnoCambioMatricula') ? $('adminAlumnoCambioMatricula').closest('.admin-alumnos-readonly').querySelector('span') : null;
      if (cambioMatriculaLabel) cambioMatriculaLabel.textContent = 'Matr\u00edcula';
      renderAdminAlumnosList();
      renderAlumnoEditor();
      renderAlumnoCambioGrupo();
      renderAlumnoHistorial();
      renderAlumnoDeleteControl();
    }

    function bindAdminAlumnosEvents() {
      if ($('adminAlumnosSearch')) $('adminAlumnosSearch').addEventListener('input', (event) => {
        state.alumnosUi.search = event.currentTarget.value;
        scheduleUiDebounce('admin-alumnos-search', () => renderAdminAlumnosModule());
      });
      if ($('adminAlumnosGroupFilter')) $('adminAlumnosGroupFilter').addEventListener('change', (event) => {
        state.alumnosUi.grupo = event.currentTarget.value;
        renderAdminAlumnosModule();
      });
      if ($('adminAlumnosFilterAllBtn')) $('adminAlumnosFilterAllBtn').addEventListener('click', () => {
        state.alumnosUi.filter = 'todos';
        renderAdminAlumnosModule();
      });
      if ($('adminAlumnosFilterActiveBtn')) $('adminAlumnosFilterActiveBtn').addEventListener('click', () => {
        state.alumnosUi.filter = 'activos';
        renderAdminAlumnosModule();
      });
      if ($('adminAlumnosFilterPauseBtn')) $('adminAlumnosFilterPauseBtn').addEventListener('click', () => {
        state.alumnosUi.filter = 'pausa';
        renderAdminAlumnosModule();
      });
      if ($('adminAlumnosFilterInactiveBtn')) $('adminAlumnosFilterInactiveBtn').addEventListener('click', () => {
        state.alumnosUi.filter = 'inactivos';
        renderAdminAlumnosModule();
      });
      if ($('adminAlumnosFilterGraduatedBtn')) $('adminAlumnosFilterGraduatedBtn').addEventListener('click', () => {
        state.alumnosUi.filter = 'egresados';
        renderAdminAlumnosModule();
      });
      if ($('adminAlumnosFilterArchivedBtn')) $('adminAlumnosFilterArchivedBtn').addEventListener('click', () => {
        state.alumnosUi.filter = 'archivados';
        renderAdminAlumnosModule();
      });
      if ($('adminAlumnoDeleteToggleBtn')) $('adminAlumnoDeleteToggleBtn').addEventListener('click', () => toggleAlumnoDeleteControl());
      if ($('adminAlumnoNewBtn')) $('adminAlumnoNewBtn').addEventListener('click', () => openAlumnoEditor('new'));
      if ($('adminAlumnoMatricula')) $('adminAlumnoMatricula').addEventListener('input', (event) => { state.alumnosUi.editor.matricula = event.currentTarget.value; });
      if ($('adminAlumnoNombres')) $('adminAlumnoNombres').addEventListener('input', (event) => {
        state.alumnosUi.editor.nombres = event.currentTarget.value;
        syncAlumnoAliasSuggestion();
      });
      if ($('adminAlumnoAlias')) $('adminAlumnoAlias').addEventListener('input', (event) => {
        state.alumnosUi.editor.alias = event.currentTarget.value;
        state.alumnosUi.editor.aliasTouched = String(event.currentTarget.value || '').trim().length > 0;
      });
      if ($('adminAlumnoApellidos')) $('adminAlumnoApellidos').addEventListener('input', (event) => { state.alumnosUi.editor.apellidos = event.currentTarget.value; });
      if ($('adminAlumnoGrupo')) $('adminAlumnoGrupo').addEventListener('change', (event) => { state.alumnosUi.editor.grupo_id = event.currentTarget.value; });
      if ($('adminAlumnoStatus')) $('adminAlumnoStatus').addEventListener('change', (event) => { state.alumnosUi.editor.estatus = event.currentTarget.value; });
      if ($('adminAlumnoNotas')) $('adminAlumnoNotas').addEventListener('input', (event) => { state.alumnosUi.editor.notas_internas = event.currentTarget.value; });
      if ($('adminAlumnoCancelBtn')) $('adminAlumnoCancelBtn').addEventListener('click', () => {
        closeAlumnoEditor();
        renderAdminAlumnosModule();
      });
      if ($('adminAlumnoSaveBtn')) $('adminAlumnoSaveBtn').addEventListener('click', (event) => saveAlumnoEditor(event.currentTarget));
      if ($('adminAlumnoCambioGrupoNuevo')) $('adminAlumnoCambioGrupoNuevo').addEventListener('change', (event) => { state.alumnosUi.cambioGrupo.nuevo_grupo_id = event.currentTarget.value; });
      if ($('adminAlumnoCambioMotivo')) $('adminAlumnoCambioMotivo').addEventListener('input', (event) => { state.alumnosUi.cambioGrupo.motivo = event.currentTarget.value; });
      if ($('adminAlumnoCambioCancelBtn')) $('adminAlumnoCambioCancelBtn').addEventListener('click', () => {
        closeCambioGrupo();
        renderAdminAlumnosModule();
      });
      if ($('adminAlumnoCambioConfirmBtn')) $('adminAlumnoCambioConfirmBtn').addEventListener('click', (event) => confirmCambioGrupo(event.currentTarget));
      if ($('adminAlumnoHistorialCloseBtn')) $('adminAlumnoHistorialCloseBtn').addEventListener('click', () => {
        closeAlumnoHistorial();
        renderAdminAlumnosModule();
      });
      document.addEventListener('click', handleAlumnoPanelOutsideClick);
      if ($('adminAlumnoDeleteIds')) $('adminAlumnoDeleteIds').addEventListener('input', (event) => {
        const control = getAlumnoDeleteControlState();
        control.idsText = event.currentTarget.value;
        control.preview = null;
        control.previewIds = [];
        control.lastResult = null;
        control.confirmationText = '';
        if ($('adminAlumnoDeleteConfirm')) $('adminAlumnoDeleteConfirm').value = '';
        renderAlumnoDeletePreview();
      });
      if ($('adminAlumnoDeleteTrashFiles')) $('adminAlumnoDeleteTrashFiles').addEventListener('change', (event) => {
        getAlumnoDeleteControlState().trashReportFiles = !!event.currentTarget.checked;
      });
      if ($('adminAlumnoDeleteConfirm')) $('adminAlumnoDeleteConfirm').addEventListener('input', (event) => {
        getAlumnoDeleteControlState().confirmationText = event.currentTarget.value;
      });
      if ($('adminAlumnoDeletePreviewBtn')) $('adminAlumnoDeletePreviewBtn').addEventListener('click', (event) => previewAlumnoDeleteControl(event.currentTarget));
      if ($('adminAlumnoDeleteExecuteBtn')) $('adminAlumnoDeleteExecuteBtn').addEventListener('click', (event) => executeAlumnoDeleteControl(event.currentTarget));
    }

    function canManageFacilitadoresCatalog() {
      return getCurrentRole() === 'admin';
    }

    function getAdminFacilitadoresCatalog() {
      const rows = Array.isArray(state.catalogos.facilitadores_admin) && state.catalogos.facilitadores_admin.length
        ? state.catalogos.facilitadores_admin
        : (state.catalogos.facilitadores || []);
      return rows.map((row) => ({
        facilitador_id: String(row.facilitador_id || '').trim(),
        nombre_completo: String(row.nombre_completo || '').trim(),
        nombre_mostrado: String(row.nombre_mostrado || '').trim(),
        color_ui: String(row.color_ui || '').trim(),
        activo: isTruthyValue(row.activo),
        rol: String(row.rol || 'facilitador').trim(),
        fecha_alta: toYmdFrontend_(row.fecha_alta || ''),
        fecha_baja: toYmdFrontend_(row.fecha_baja || ''),
        archivado_at: String(row.archivado_at || '').trim(),
        archivado_por: String(row.archivado_por || '').trim()
      }));
    }

    function getFacilitadorById(facilitadorId) {
      const id = String(facilitadorId || '').trim();
      return getAdminFacilitadoresCatalog().find((row) => row.facilitador_id === id) || null;
    }

    function applySavedFacilitadorCatalogRow(row) {
      if (!row || !row.facilitador_id) return null;
      upsertCatalogEntityRow('facilitadores_admin', 'facilitador_id', row);
      upsertCatalogEntityRow('facilitadores', 'facilitador_id', row);
      return getFacilitadorById(row.facilitador_id);
    }

    function applyPatchedFacilitadorCatalogRow(facilitadorId, patch = {}) {
      const current = getFacilitadorById(facilitadorId);
      if (!current) return null;
      return applySavedFacilitadorCatalogRow(Object.assign({}, current, patch));
    }

    function applySavedFacilitadorAsignacionCatalogRow(row) {
      if (!row || !row.asignacion_id) return null;
      const current = (Array.isArray(state.catalogos.facilitador_asignaciones) ? state.catalogos.facilitador_asignaciones : [])
        .find((item) => String((item && item.asignacion_id) || '').trim() === String(row.asignacion_id || '').trim());
      const merged = Object.assign({}, current || {}, row);
      const normalized = Object.assign({}, merged, {
        asignacion_id: String(merged.asignacion_id || '').trim(),
        facilitador_id: String(merged.facilitador_id || '').trim(),
        grupo_id: String(merged.grupo_id || '').trim(),
        materia_id: String(merged.materia_id || '').trim(),
        taller_id: String(merged.taller_id || '').trim(),
        activa: merged.activa === undefined ? true : merged.activa,
        fecha_inicio: toYmdFrontend_(merged.fecha_inicio || ''),
        fecha_fin: toYmdFrontend_(merged.fecha_fin || ''),
        archivado_at: String(merged.archivado_at || merged.archivada_at || '').trim(),
        archivada_at: String(merged.archivada_at || merged.archivado_at || '').trim(),
        archivado_por: String(merged.archivado_por || merged.archivada_por || '').trim(),
        archivada_por: String(merged.archivada_por || merged.archivado_por || '').trim()
      });
      return upsertCatalogEntityRow('facilitador_asignaciones', 'asignacion_id', normalized);
    }

    function getFacilitadorVisualStatus(row) {
      if (!row) return 'inactivo';
      if (String(row.archivado_at || '').trim()) return 'archivado';
      return row.activo ? 'activo' : 'inactivo';
    }

    function getFacilitadorStatusLabel(status) {
      if (status === 'archivado') return 'Archivado';
      if (status === 'inactivo') return 'Inactivo';
      return 'Activo';
    }

    function getFacilitadorStatusBadgeClass(status) {
      if (status === 'archivado') return 'is-archived';
      if (status === 'inactivo') return 'is-inactive';
      return 'is-active';
    }

    function getFacilitadorStatusSortWeight(status) {
      if (status === 'activo') return 0;
      if (status === 'inactivo') return 1;
      return 2;
    }

    function getFacilitadorAsignaciones(facilitadorId, options = {}) {
      const includeArchived = !!options.includeArchived;
      return (Array.isArray(state.catalogos.facilitador_asignaciones) ? state.catalogos.facilitador_asignaciones : [])
        .filter((row) => String(row.facilitador_id || '').trim() === String(facilitadorId || '').trim())
        .filter((row) => includeArchived || !String(row.archivado_at || row.archivada_at || '').trim())
        .map((row) => ({
          asignacion_id: String(row.asignacion_id || '').trim(),
          facilitador_id: String(row.facilitador_id || '').trim(),
          grupo_id: String(row.grupo_id || '').trim(),
          materia_id: String(row.materia_id || '').trim(),
          taller_id: String(row.taller_id || '').trim(),
          activa: isTruthyValue(row.activa),
          fecha_inicio: toYmdFrontend_(row.fecha_inicio || ''),
          fecha_fin: toYmdFrontend_(row.fecha_fin || ''),
          fecha_creacion: row.fecha_creacion || '',
          fecha_actualizacion: row.fecha_actualizacion || '',
          archivado_at: String(row.archivado_at || row.archivada_at || '').trim(),
          archivado_por: String(row.archivado_por || row.archivada_por || '').trim(),
          archivada_at: String(row.archivada_at || row.archivado_at || '').trim(),
          archivada_por: String(row.archivada_por || row.archivado_por || '').trim()
        }))
        .sort((a, b) => {
          const getLabel = (asig) => {
            if (asig.taller_id) {
              const taller = ((state.catalogos.talleres_admin || state.catalogos.talleres || []).find((t) => t.taller_id === asig.taller_id) || {});
              return taller.nombre || asig.taller_id;
            }
            const materiaNombre = ((state.catalogos.materias || []).find((item) => item.materia_id === asig.materia_id) || {}).nombre || asig.materia_id;
            return getGrupoNombre(asig.grupo_id) + ' ' + materiaNombre;
          };
          return String(getLabel(a) || '').localeCompare(String(getLabel(b) || ''), 'es');
        });
    }

    function getFacilitadorSearchText(row) {
      return [
        row.facilitador_id,
        row.nombre_completo,
        row.nombre_mostrado,
        row.rol
      ].join(' ').toLowerCase();
    }

    function getFilteredFacilitadores() {
      const filter = String(state.facilitadoresUi.filter || 'activos').trim();
      const query = String(state.facilitadoresUi.search || '').trim().toLowerCase();
      return getAdminFacilitadoresCatalog()
        .filter((row) => {
          const visualStatus = getFacilitadorVisualStatus(row);
          if (filter === 'activos' && visualStatus !== 'activo') return false;
          if (filter === 'inactivos' && visualStatus !== 'inactivo') return false;
          if (filter === 'archivados' && visualStatus !== 'archivado') return false;
          if (!query) return true;
          return getFacilitadorSearchText(row).includes(query);
        })
        .sort((a, b) => {
          const weightDiff = getFacilitadorStatusSortWeight(getFacilitadorVisualStatus(a)) - getFacilitadorStatusSortWeight(getFacilitadorVisualStatus(b));
          if (weightDiff) return weightDiff;
          return String(a.nombre_mostrado || a.nombre_completo || a.facilitador_id).localeCompare(String(b.nombre_mostrado || b.nombre_completo || b.facilitador_id), 'es');
        });
    }

    function getVisibleFacilitadores() {
      return getFilteredFacilitadores();
    }

    function getFacilitadorListTitle() {
      const filter = String(state.facilitadoresUi.filter || 'activos').trim();
      if (filter === 'todos') return 'Todos los facilitadores';
      if (filter === 'inactivos') return 'Facilitadores inactivos';
      if (filter === 'archivados') return 'Facilitadores archivados';
      return 'Facilitadores activos';
    }

    function getFacilitadorRecentWeeks() {
      const rows = Array.isArray(state.catalogos.semanas) ? state.catalogos.semanas : [];
      const today = getTodayYmdLocal();
      const seenRanges = new Set();
      const sorted = rows
        .slice()
        .filter((row) => toYmdFrontend_(row.fecha_inicio || '') || toYmdFrontend_(row.fecha_fin || ''))
        .filter((row) => {
          const start = toYmdFrontend_(row.fecha_inicio || '');
          const end = toYmdFrontend_(row.fecha_fin || '');
          const key = start + '|' + end;
          if (seenRanges.has(key)) return false;
          seenRanges.add(key);
          return true;
        })
        .sort((a, b) => {
          const startDiff = String(toYmdFrontend_(a.fecha_inicio || '')).localeCompare(String(toYmdFrontend_(b.fecha_inicio || '')));
          if (startDiff) return startDiff;
          return String(toYmdFrontend_(a.fecha_fin || '')).localeCompare(String(toYmdFrontend_(b.fecha_fin || '')));
        });
      if (!sorted.length) return [];
      const currentIndex = sorted.findIndex((row) => {
        const start = toYmdFrontend_(row.fecha_inicio || '');
        const end = toYmdFrontend_(row.fecha_fin || '') || start;
        return today && start && start <= today && (!end || today <= end);
      });
      let anchorIndex = currentIndex;
      if (anchorIndex === -1) {
        for (let index = sorted.length - 1; index >= 0; index -= 1) {
          const start = toYmdFrontend_(sorted[index].fecha_inicio || '');
          if (start && today && start <= today) {
            anchorIndex = index;
            break;
          }
        }
      }
      if (anchorIndex === -1) {
        anchorIndex = 0;
      }
      const startIndex = Math.max(0, anchorIndex - 3);
      const endIndex = Math.min(sorted.length, anchorIndex + 2);
      return sorted.slice(startIndex, endIndex);
    }

    function isCurrentSemana(semana) {
      const today = getTodayYmdLocal();
      const start = toYmdFrontend_(semana && semana.fecha_inicio || '');
      const end = toYmdFrontend_(semana && semana.fecha_fin || '') || start;
      return !!(today && start && start <= today && (!end || today <= end));
    }

    function isAssignmentActiveForSemana(asignacion, semana) {
      if (!asignacion || !semana) return false;
      if (String(asignacion.archivado_at || '').trim()) return false;
      if (!asignacion.activa) return false;
      const weekStart = toYmdFrontend_(semana.fecha_inicio || '');
      const weekEnd = toYmdFrontend_(semana.fecha_fin || '');
      const start = toYmdFrontend_(asignacion.fecha_inicio || '');
      const end = toYmdFrontend_(asignacion.fecha_fin || '');
      if (start && weekEnd && weekEnd < start) return false;
      if (end && weekStart && weekStart > end) return false;
      return true;
    }

    function getFacilitadorPulsePlaneaciones(facilitadorId) {
      const id = String(facilitadorId || '').trim();
      if (
        state.facilitadoresUi &&
        String(state.facilitadoresUi.pulsePlaneacionesFacilitadorId || '').trim() === id &&
        Array.isArray(state.facilitadoresUi.pulsePlaneaciones)
      ) {
        return state.facilitadoresUi.pulsePlaneaciones;
      }
      if (String(state.activeAdminModule || '').trim() === 'planeaciones') {
        return state.planeaciones || [];
      }
      return [];
    }

    function isFacilitadorPulseDataLoading(facilitadorId) {
      return !!(
        state.facilitadoresUi &&
        state.facilitadoresUi.pulsePlaneacionesLoading &&
        String(state.facilitadoresUi.pulsePlaneacionesFacilitadorId || '').trim() === String(facilitadorId || '').trim()
      );
    }

    function isFacilitadorPulseDataLoaded(facilitadorId) {
      return !!(
        state.facilitadoresUi &&
        !state.facilitadoresUi.pulsePlaneacionesLoading &&
        !String(state.facilitadoresUi.pulsePlaneacionesError || '').trim() &&
        String(state.facilitadoresUi.pulsePlaneacionesFacilitadorId || '').trim() === String(facilitadorId || '').trim()
      );
    }

    function getFacilitadorPlanForCell(facilitadorId, asignacion, semanaId) {
      const matches = getFacilitadorPulsePlaneaciones(facilitadorId).filter((plan) => {
        if (String(plan.facilitador_id || '').trim() !== String(facilitadorId || '').trim()) return false;
        if (String(plan.semana_id || '').trim() !== String(semanaId || '').trim()) return false;
        // Asignación tipo taller: buscar plan por taller_id
        if (asignacion.taller_id) {
          return String(plan.taller_id || '').trim() === asignacion.taller_id;
        }
        // Asignación tipo grupo: buscar plan por grupo_id + materia_id
        return String(plan.grupo_id || '').trim() === String(asignacion.grupo_id || '').trim() &&
               String(plan.materia_id || '').trim() === String(asignacion.materia_id || '').trim();
      });
      if (!matches.length) return null;
      return matches.sort((a, b) => String(b.fecha_actualizacion || b.fecha_creacion || '').localeCompare(String(a.fecha_actualizacion || a.fecha_creacion || '')))[0] || null;
    }

    function getFacilitadorPlanAlertCount(planId) {
      return (state.alertas || []).filter((alerta) => {
        return String(alerta.planeacion_id || '').trim() === String(planId || '').trim() &&
          String(alerta.estado || '').trim() !== 'resuelta';
      }).length;
    }

    function getFacilitadorMatrixCellState(facilitadorId, asignacion, semana) {
      if (!isAssignmentActiveForSemana(asignacion, semana)) {
        return { code: 'na', label: '\u2014', title: 'Sin asignaci\u00f3n activa en esta semana' };
      }
      const plan = getFacilitadorPlanForCell(facilitadorId, asignacion, semana.semana_id);
      if (!plan) {
        return { code: 'missing', label: 'Falta', title: 'No existe una planeaci\u00f3n registrada para esta asignaci\u00f3n en la semana.' };
      }
      if (getFacilitadorPlanAlertCount(plan.planeacion_id)) {
        return { code: 'alert', label: 'Alerta', title: 'La planeaci\u00f3n tiene alertas abiertas.' };
      }
      const status = String(plan.estado || '').trim();
      if (status === 'cierre_pendiente') {
        return { code: 'pending', label: 'Cierre', title: 'La planeaci\u00f3n qued\u00f3 en cierre pendiente.' };
      }
      if (status === 'cerrada' || status === 'archivada') {
        return { code: 'closed', label: 'Cerrada', title: 'La planeaci\u00f3n ya cerr\u00f3 su ciclo operativo.' };
      }
      return { code: 'ok', label: 'Lista', title: 'La planeaci\u00f3n est\u00e1 registrada y operativa.' };
    }

    function buildFacilitadorPulse(facilitadorId) {
      const asignaciones = getFacilitadorAsignaciones(facilitadorId).filter((row) => row.activa);
      const semanas = getFacilitadorRecentWeeks();
      let esperadas = 0;
      let entregadas = 0;
      let faltantes = 0;
      let cierresPendientes = 0;
      asignaciones.forEach((asignacion) => {
        semanas.forEach((semana) => {
          const stateCell = getFacilitadorMatrixCellState(facilitadorId, asignacion, semana);
          if (stateCell.code === 'na') return;
          esperadas += 1;
          if (stateCell.code === 'missing') faltantes += 1;
          else entregadas += 1;
          if (stateCell.code === 'pending') cierresPendientes += 1;
        });
      });
      const planesIds = new Set((state.planeaciones || [])
        .filter((plan) => String(plan.facilitador_id || '').trim() === String(facilitadorId || '').trim())
        .map((plan) => plan.planeacion_id));
      getFacilitadorPulsePlaneaciones(facilitadorId)
        .filter((plan) => String(plan.facilitador_id || '').trim() === String(facilitadorId || '').trim())
        .forEach((plan) => {
          if (plan && plan.planeacion_id) planesIds.add(plan.planeacion_id);
        });
      const alertasAbiertas = (state.alertas || []).filter((alerta) => planesIds.has(alerta.planeacion_id) && String(alerta.estado || '').trim() !== 'resuelta').length;
      return { esperadas, entregadas, faltantes, cierresPendientes, alertasAbiertas };
    }

    function getFacilitadorUpdatedLabel(facilitador) {
      if (!facilitador) return 'Sin registro';
      const facilitadorId = String(facilitador.facilitador_id || '').trim();
      const latestPlan = getFacilitadorPulsePlaneaciones(facilitadorId)
        .slice()
        .sort((a, b) => String(b.fecha_actualizacion || b.fecha_creacion || '').localeCompare(String(a.fecha_actualizacion || a.fecha_creacion || '')))[0] ||
        getPlaneacionesIndex().latestByFacilitadorId.get(facilitadorId);
      const latestValue = latestPlan
        ? (latestPlan.fecha_actualizacion || latestPlan.fecha_creacion || '')
        : (facilitador.archivado_at || facilitador.fecha_baja || facilitador.fecha_alta || '');
      return latestValue ? getNotificationRelativeUpdateLabel(latestValue) : 'Sin registro';
    }

    function buildFacilitadorPulseSummary(facilitadorId) {
      if (!isFacilitadorPulseDataLoaded(facilitadorId)) {
        return isFacilitadorPulseDataLoading(facilitadorId) ? 'Calculando pulso...' : 'Abre panel para calcular';
      }
      const pulse = buildFacilitadorPulse(facilitadorId);
      const parts = [];
      if (pulse.faltantes) parts.push(pulse.faltantes + ' faltante(s)');
      if (pulse.cierresPendientes) parts.push(pulse.cierresPendientes + ' cierre(s)');
      if (pulse.alertasAbiertas) parts.push(pulse.alertasAbiertas + ' alerta(s)');
      return parts.join(' \u00b7 ') || 'Sin pendientes cr\u00edticos';
    }

    function closeFacilitadorEditor() {
      state.facilitadoresUi.editorOpen = false;
      state.facilitadoresUi.editorMode = 'new';
      state.facilitadoresUi.editor = createEmptyFacilitadorEditorState();
    }

    function closeFacilitadorPin() {
      state.facilitadoresUi.pinOpen = false;
      state.facilitadoresUi.pinValue = '';
    }

    function closeFacilitadorAsignacionEditor() {
      state.facilitadoresUi.asignacionOpen = false;
      state.facilitadoresUi.asignacion = createEmptyFacilitadorAsignacionState();
    }

    function syncAdminFacilitadoresModule() {
      const visible = getVisibleFacilitadores();
      const selected = String(state.facilitadoresUi.selectedFacilitadorId || '').trim();
      if (selected && visible.some((row) => row.facilitador_id === selected)) return;
      state.facilitadoresUi.selectedFacilitadorId = visible.length ? visible[0].facilitador_id : '';
      if (!visible.length) {
        closeFacilitadorEditor();
        closeFacilitadorPin();
        closeFacilitadorAsignacionEditor();
      }
    }

    function ensureFacilitadorPulsePlaneacionesLoaded(facilitadorId) {
      const id = String(facilitadorId || '').trim();
      if (!id || !canUseAdminShell()) return;
      if (
        state.facilitadoresUi.pulsePlaneacionesLoading &&
        String(state.facilitadoresUi.pulsePlaneacionesFacilitadorId || '').trim() === id
      ) return;
      if (
        String(state.facilitadoresUi.pulsePlaneacionesError || '').trim() &&
        String(state.facilitadoresUi.pulsePlaneacionesFacilitadorId || '').trim() === id
      ) return;
      if (isFacilitadorPulseDataLoaded(id)) return;
      state.facilitadoresUi.pulsePlaneacionesFacilitadorId = id;
      state.facilitadoresUi.pulsePlaneaciones = [];
      state.facilitadoresUi.pulsePlaneacionesLoading = true;
      state.facilitadoresUi.pulsePlaneacionesError = '';
      api('getPlaneaciones', {
        facilitador_id: id,
        include_detail: false,
        limit: 500,
        offset: 0
      })
        .then((data) => {
          if (String(state.facilitadoresUi.selectedFacilitadorId || '').trim() !== id) return;
          state.facilitadoresUi.pulsePlaneacionesFacilitadorId = id;
          state.facilitadoresUi.pulsePlaneaciones = Array.isArray(data && data.rows) ? data.rows : [];
          state.facilitadoresUi.pulsePlaneacionesLoading = false;
          state.facilitadoresUi.pulsePlaneacionesError = '';
          renderAdminFacilitadoresModule();
        })
        .catch((err) => {
          if (String(state.facilitadoresUi.selectedFacilitadorId || '').trim() !== id) return;
          state.facilitadoresUi.pulsePlaneacionesFacilitadorId = id;
          state.facilitadoresUi.pulsePlaneaciones = [];
          state.facilitadoresUi.pulsePlaneacionesLoading = false;
          state.facilitadoresUi.pulsePlaneacionesError = formatApiError(err);
          renderAdminFacilitadoresModule();
        });
    }

    function getAdminFacilitadoresModuleTemplate() {
      return [
        '<article class="admin-toolbar admin-alumnos-module admin-facilitadores-module">',
          '<div class="admin-toolbar-head admin-alumnos-head">',
            '<div class="admin-alumnos-head-copy">',
              '<h3>Facilitadores</h3>',
              '<p class="subtle">Administra accesos, asignaciones y pulso semanal del equipo acad&eacute;mico.</p>',
            '</div>',
            '<div class="admin-alumnos-head-actions">',
              '<label class="admin-alumnos-search" for="adminFacilitadoresSearch">',
                '<span>Buscar</span>',
                '<input id="adminFacilitadoresSearch" type="search" placeholder="Buscar por ID o nombre">',
              '</label>',
              '<button id="adminFacilitadorNewBtn" class="btn-primary" type="button">Nuevo facilitador</button>',
            '</div>',
          '</div>',
          '<div class="admin-alumnos-filterbar">',
            '<div class="admin-alumnos-filterchips">',
              '<button id="adminFacilitadoresFilterAllBtn" class="btn-ghost" type="button">Todos</button>',
              '<button id="adminFacilitadoresFilterActiveBtn" class="btn-ghost" type="button">Activos</button>',
              '<button id="adminFacilitadoresFilterInactiveBtn" class="btn-ghost" type="button">Inactivos</button>',
              '<button id="adminFacilitadoresFilterArchivedBtn" class="btn-ghost" type="button">Archivados</button>',
            '</div>',
          '</div>',
          '<div class="admin-alumnos-layout">',
            '<section class="admin-alumnos-main">',
              '<div class="admin-alumnos-section-head">',
                '<div>',
                  '<h4 id="adminFacilitadoresListTitle">Facilitadores activos</h4>',
                  '<div id="adminFacilitadoresListMeta" class="subtle">Pulso semanal, asignaciones y accesos operativos.</div>',
                '</div>',
              '</div>',
              '<div id="adminFacilitadoresList" class="admin-alumnos-list"></div>',
            '</section>',
            '<aside class="admin-alumnos-side">',
              '<section id="adminFacilitadorDetailPanel" class="admin-alumnos-panel"></section>',
              '<section id="adminFacilitadorEditorPanel" class="admin-alumnos-panel" hidden>',
                '<div class="admin-alumnos-panel-head">',
                  '<div>',
                    '<h4 id="adminFacilitadorEditorTitle">Nuevo facilitador</h4>',
                    '<div class="subtle">Configura identidad operativa y acceso del facilitador.</div>',
                  '</div>',
                '</div>',
                '<div class="admin-alumnos-editor-grid">',
                  '<label class="field">',
                    '<span>Facilitador ID</span>',
                    '<input id="adminFacilitadorIdInput" type="text" maxlength="50" placeholder="Ej. FAC-009">',
                  '</label>',
                  '<label class="field">',
                    '<span>Rol</span>',
                    '<select id="adminFacilitadorRolInput">',
                      '<option value="facilitador">Facilitador</option>',
                      '<option value="directora">Directora</option>',
                      '<option value="admin">Admin</option>',
                    '</select>',
                  '</label>',
                  '<label class="field">',
                    '<span>Nombre completo</span>',
                    '<input id="adminFacilitadorNombreCompletoInput" type="text" maxlength="150" placeholder="Nombre completo">',
                  '</label>',
                  '<label class="field">',
                    '<span>Nombre mostrado</span>',
                    '<input id="adminFacilitadorNombreMostradoInput" type="text" maxlength="100" placeholder="Nombre corto visible">',
                  '</label>',
                  '<label class="field">',
                    '<span>Color UI</span>',
                    '<input id="adminFacilitadorColorInput" type="text" maxlength="30" placeholder="Ej. cyan o #41c9ff">',
                  '</label>',
                  '<label class="field">',
                    '<span>Estatus</span>',
                    '<select id="adminFacilitadorActivoInput">',
                      '<option value="si">Activo</option>',
                      '<option value="no">Inactivo</option>',
                    '</select>',
                  '</label>',
                  '<label class="field admin-alumnos-field-full">',
                    '<span>PIN temporal</span>',
                    '<input id="adminFacilitadorPinInput" type="password" maxlength="20" placeholder="Opcional al editar &middot; requerido al crear">',
                  '</label>',
                '</div>',
                '<div class="actions compact admin-alumnos-panel-actions">',
                  '<button id="adminFacilitadorCancelBtn" class="btn-ghost" type="button">Cancelar</button>',
                  '<button id="adminFacilitadorSaveBtn" class="btn-primary" type="button">Guardar</button>',
                '</div>',
              '</section>',
            '</aside>',
          '</div>',
        '</article>'
      ].join('');
    }

    function renderAdminFacilitadoresModule() {
      const panel = $('admin-panel-facilitadores');
      if (!panel || !canUseAdminShell()) return;
      if (panel.dataset.ready !== '1') {
        panel.innerHTML = getAdminFacilitadoresModuleTemplate();
        panel.dataset.ready = '1';
        bindAdminFacilitadoresEvents();
      }
      syncAdminFacilitadoresModule();
      if ($('adminFacilitadoresSearch')) $('adminFacilitadoresSearch').value = state.facilitadoresUi.search || '';
      if ($('adminFacilitadorNewBtn')) $('adminFacilitadorNewBtn').hidden = !canManageFacilitadoresCatalog();
      if ($('adminFacilitadoresFilterAllBtn')) $('adminFacilitadoresFilterAllBtn').classList.toggle('is-active', state.facilitadoresUi.filter === 'todos');
      if ($('adminFacilitadoresFilterActiveBtn')) $('adminFacilitadoresFilterActiveBtn').classList.toggle('is-active', state.facilitadoresUi.filter === 'activos');
      if ($('adminFacilitadoresFilterInactiveBtn')) $('adminFacilitadoresFilterInactiveBtn').classList.toggle('is-active', state.facilitadoresUi.filter === 'inactivos');
      if ($('adminFacilitadoresFilterArchivedBtn')) $('adminFacilitadoresFilterArchivedBtn').classList.toggle('is-active', state.facilitadoresUi.filter === 'archivados');
      renderAdminFacilitadoresList();
      renderFacilitadorDetailPanel();
      renderFacilitadorEditorPanel();
      if (state.facilitadoresUi.asignacionOpen) {
        fillSelect($('adminFacilitadorAsignacionGrupo'), state.catalogos.grupos || [], (item) => item.grupo_id, (item) => getGrupoDisplayName(item), 'Selecciona grupo');
        fillSelect($('adminFacilitadorAsignacionMateria'), state.catalogos.materias || [], (item) => item.materia_id, (item) => item.nombre || item.materia_id, 'Selecciona materia');
        if ($('adminFacilitadorAsignacionGrupo')) $('adminFacilitadorAsignacionGrupo').value = state.facilitadoresUi.asignacion.grupo_id || '';
        if ($('adminFacilitadorAsignacionMateria')) $('adminFacilitadorAsignacionMateria').value = state.facilitadoresUi.asignacion.materia_id || '';
        if ($('adminFacilitadorAsignacionInicio')) $('adminFacilitadorAsignacionInicio').value = state.facilitadoresUi.asignacion.fecha_inicio || '';
        if ($('adminFacilitadorAsignacionFin')) $('adminFacilitadorAsignacionFin').value = state.facilitadoresUi.asignacion.fecha_fin || '';
      }
    }

    function renderAdminFacilitadoresList() {
      const host = $('adminFacilitadoresList');
      if (!host) return;
      const rows = getVisibleFacilitadores();
      if ($('adminFacilitadoresListTitle')) $('adminFacilitadoresListTitle').textContent = getFacilitadorListTitle();
      if ($('adminFacilitadoresListMeta')) $('adminFacilitadoresListMeta').textContent = rows.length + ' facilitador(es) visibles en esta vista.';
      if (!rows.length) {
        host.innerHTML = '<div class="admin-alumnos-empty"><div><strong>No hay facilitadores para mostrar.</strong><div class="subtle">Ajusta el filtro o crea un nuevo facilitador para empezar.</div></div></div>';
        return;
      }
      host.innerHTML = [
        '<div class="admin-alumnos-table">',
          '<div class="admin-facilitadores-list-header">',
            '<div>ID</div>',
            '<div>Facilitador</div>',
            '<div>Rol</div>',
            '<div>Estado</div>',
            '<div>Asignaciones</div>',
            '<div>Pulso</div>',
            '<div>Acciones</div>',
          '</div>',
          rows.map((row) => {
            const visualStatus = getFacilitadorVisualStatus(row);
            const asignaciones = getFacilitadorAsignaciones(row.facilitador_id).filter((item) => item.activa);
            const pulseText = buildFacilitadorPulseSummary(row.facilitador_id);
            const actions = [
            '<button class="btn-ghost" type="button" onclick="openFacilitadorPanel(\'' + escapeJsAttrValue(row.facilitador_id) + '\')">Ver panel</button>'
            ];
            return [
              '<article class="admin-facilitadores-row">',
                '<div class="admin-alumnos-cell"><div class="mini">' + escapeHtml(row.facilitador_id) + '</div></div>',
                '<div class="admin-alumnos-title"><strong>' + escapeHtml(row.nombre_mostrado || row.nombre_completo || row.facilitador_id) + '</strong><div class="mini">' + escapeHtml(row.nombre_completo || 'Sin nombre') + '</div></div>',
                '<div class="admin-alumnos-cell"><div class="mini">' + escapeHtml((row.rol || 'facilitador').replace('directora', 'directora')) + '</div></div>',
                '<div class="admin-alumnos-cell"><span class="admin-alumnos-badge ' + getFacilitadorStatusBadgeClass(visualStatus) + '">' + escapeHtml(getFacilitadorStatusLabel(visualStatus)) + '</span></div>',
                '<div class="admin-alumnos-cell"><div class="mini">' + escapeHtml(String(asignaciones.length)) + ' activa(s)</div></div>',
                '<div class="admin-alumnos-cell is-pulse"><div class="mini">' + escapeHtml(pulseText) + '</div></div>',
                '<div class="admin-alumnos-actions">' + actions.join('') + '</div>',
              '</article>'
            ].join('');
          }).join(''),
        '</div>'
      ].join('');
    }

    function renderFacilitadorDetailPanel() {
      const host = $('adminFacilitadorDetailPanel');
      if (!host) return;
      const facilitador = getFacilitadorById(state.facilitadoresUi.selectedFacilitadorId);
      if (!facilitador) {
        host.innerHTML = '<div class="admin-alumnos-empty"><div><strong>Selecciona un facilitador</strong><div class="subtle">Aqu&iacute; aparecer&aacute;n sus asignaciones, pulso semanal y accesos r&aacute;pidos.</div></div></div>';
        return;
      }
      ensureFacilitadorPulsePlaneacionesLoaded(facilitador.facilitador_id);
      const visualStatus = getFacilitadorVisualStatus(facilitador);
      const pulseReady = isFacilitadorPulseDataLoaded(facilitador.facilitador_id);
      const pulse = pulseReady
        ? buildFacilitadorPulse(facilitador.facilitador_id)
        : { esperadas: '...', entregadas: '...', faltantes: '...', cierresPendientes: '...', alertasAbiertas: '...' };
      const asignaciones = getFacilitadorAsignaciones(facilitador.facilitador_id);
      const canManage = canManageFacilitadoresCatalog();
      const pinOpen = !!state.facilitadoresUi.pinOpen;
      const asignacionOpen = !!state.facilitadoresUi.asignacionOpen;
      host.hidden = false;
      host.innerHTML = [
        '<div class="admin-facilitadores-summary">',
          '<div class="admin-facilitadores-identity">',
            '<div>',
              '<strong>' + escapeHtml(facilitador.nombre_mostrado || facilitador.nombre_completo || facilitador.facilitador_id) + '</strong>',
              '<div class="mini">' + escapeHtml(facilitador.facilitador_id) + ' &middot; ' + escapeHtml(facilitador.rol || 'facilitador') + '</div>',
            '</div>',
            '<span class="admin-alumnos-badge ' + getFacilitadorStatusBadgeClass(visualStatus) + '">' + escapeHtml(getFacilitadorStatusLabel(visualStatus)) + '</span>',
          '</div>',
          '<div class="admin-facilitadores-inline-actions">',
            (canManage ? '<button class="btn-ghost" type="button" onclick="openFacilitadorEditor(\'edit\', \'' + escapeJsAttrValue(facilitador.facilitador_id) + '\')">Editar ficha</button>' : ''),
            '<button class="btn-secondary" type="button" onclick="openFacilitadorPlaneaciones(\'' + escapeJsAttrValue(facilitador.facilitador_id) + '\')">Ver planeaciones</button>',
            (canManage ? '<button class="btn-ghost" type="button" onclick="openFacilitadorPin(\'' + escapeJsAttrValue(facilitador.facilitador_id) + '\')">Resetear PIN</button>' : ''),
            (canManage && visualStatus === 'activo' ? '<button class="btn-ghost" type="button" onclick="toggleFacilitadorActivo(this, \'' + escapeJsAttrValue(facilitador.facilitador_id) + '\', false)">Desactivar</button>' : ''),
            (canManage && visualStatus === 'inactivo' ? '<button class="btn-primary" type="button" onclick="toggleFacilitadorActivo(this, \'' + escapeJsAttrValue(facilitador.facilitador_id) + '\', true)">Activar</button>' : ''),
            (canManage && visualStatus === 'archivado' ? '<button class="btn-primary" type="button" onclick="reactivateFacilitador(this, \'' + escapeJsAttrValue(facilitador.facilitador_id) + '\')">Reactivar</button>' : ''),
            (canManage && visualStatus !== 'archivado' ? '<button class="btn-accent" type="button" onclick="archiveFacilitador(this, \'' + escapeJsAttrValue(facilitador.facilitador_id) + '\')">Archivar</button>' : ''),
          '</div>',
          '<div class="admin-facilitadores-meta-grid">',
            '<div class="admin-alumnos-readonly"><span>Alta</span><strong>' + escapeHtml(facilitador.fecha_alta ? formatFechaHumana(facilitador.fecha_alta) : 'Sin fecha') + '</strong></div>',
            '<div class="admin-alumnos-readonly"><span>Ultima actividad</span><strong>' + escapeHtml(getFacilitadorUpdatedLabel(facilitador)) + '</strong></div>',
            '<div class="admin-alumnos-readonly"><span>Asignaciones activas</span><strong>' + escapeHtml(String(asignaciones.filter((item) => item.activa && !item.archivado_at).length)) + '</strong></div>',
            '<div class="admin-alumnos-readonly"><span>Estado operativo</span><strong>' + escapeHtml(getFacilitadorStatusLabel(visualStatus)) + '</strong></div>',
          '</div>',
          '<div class="admin-facilitadores-kpis">',
            '<div class="admin-facilitadores-kpi"><strong>' + escapeHtml(String(pulse.esperadas)) + '</strong><span>Esperadas</span></div>',
            '<div class="admin-facilitadores-kpi"><strong>' + escapeHtml(String(pulse.entregadas)) + '</strong><span>Entregadas</span></div>',
            '<div class="admin-facilitadores-kpi"><strong>' + escapeHtml(String(pulse.faltantes)) + '</strong><span>Faltantes</span></div>',
            '<div class="admin-facilitadores-kpi"><strong>' + escapeHtml(String(pulse.cierresPendientes)) + '</strong><span>Cierres</span></div>',
            '<div class="admin-facilitadores-kpi"><strong>' + escapeHtml(String(pulse.alertasAbiertas)) + '</strong><span>Alertas</span></div>',
          '</div>',
          (pinOpen && canManage ? renderFacilitadorPinBlock() : ''),
          '<div class="admin-alumnos-section-head"><div><h4>Asignaciones</h4><div class="subtle">Relaci&oacute;n grupo + materia que se espera de este facilitador.</div></div>' +
            '<div class="actions compact">' + (canUseAdminShell() ? '<button class="btn-primary" type="button" onclick="openFacilitadorAsignacionEditor(\'new\')">Nueva asignaci&oacute;n</button>' : '') + '</div></div>',
          '<div class="admin-facilitadores-assignment-list">' + renderFacilitadorAssignmentsList(facilitador.facilitador_id) + '</div>',
          (asignacionOpen ? renderFacilitadorAsignacionEditor() : ''),
          '<div class="admin-alumnos-section-head"><div><h4>Pulso semanal</h4><div class="subtle">Semanas recientes cruzadas con asignaciones activas y planeaciones existentes.</div></div></div>',
          renderFacilitadorMatrix(facilitador.facilitador_id),
        '</div>'
      ].join('');
    }

    function renderFacilitadorAssignmentsList(facilitadorId) {
      const rows = getFacilitadorAsignaciones(facilitadorId);
      if (!rows.length) {
        return '<div class="admin-alumnos-empty" style="min-height:140px;"><div><strong>Sin asignaciones activas.</strong><div class="subtle">Agrega grupo y materia para medir faltantes con confianza.</div></div></div>';
      }
      return rows.map((row) => {
        let rowLabel;
        let verBtn;
        if (row.taller_id) {
          const taller = (state.catalogos.talleres_admin || state.catalogos.talleres || []).find((t) => t.taller_id === row.taller_id);
          rowLabel = 'Taller: ' + ((taller && taller.nombre) || row.taller_id);
          verBtn = '<button class="btn-secondary" type="button" onclick="openFacilitadorPlaneaciones(\'' + escapeJsAttrValue(state.facilitadoresUi.selectedFacilitadorId) + '\', \'\', \'\', \'' + escapeJsAttrValue(row.taller_id) + '\')">Ver</button>';
        } else {
          const materia = (state.catalogos.materias || []).find((item) => item.materia_id === row.materia_id);
          rowLabel = getGrupoNombre(row.grupo_id) + ' \u00b7 ' + ((materia && materia.nombre) || row.materia_id);
          verBtn = '<button class="btn-secondary" type="button" onclick="openFacilitadorPlaneaciones(\'' + escapeJsAttrValue(state.facilitadoresUi.selectedFacilitadorId) + '\', \'' + escapeJsAttrValue(row.grupo_id) + '\', \'' + escapeJsAttrValue(row.materia_id) + '\')">Ver</button>';
        }
        const periodo = [
          row.fecha_inicio ? ('Desde ' + formatFechaHumana(row.fecha_inicio)) : '',
          row.fecha_fin ? ('Hasta ' + formatFechaHumana(row.fecha_fin)) : ''
        ].filter(Boolean).join(' \u00b7 ') || 'Sin vigencia cerrada';
        return [
          '<article class="admin-facilitadores-assignment-item">',
            '<div class="admin-facilitadores-assignment-copy">',
              '<strong>' + escapeHtml(rowLabel) + '</strong>',
              '<div class="mini">' + escapeHtml(periodo) + '</div>',
            '</div>',
            '<div class="admin-facilitadores-assignment-actions">',
          '<button class="btn-ghost" type="button" onclick="openFacilitadorAsignacionEditor(\'edit\', \'' + escapeJsAttrValue(row.asignacion_id) + '\')">Editar</button>',
          verBtn,
          '<button class="btn-accent" type="button" onclick="archiveFacilitadorAsignacion(this, \'' + escapeJsAttrValue(row.asignacion_id) + '\')">Quitar</button>',
            '</div>',
          '</article>'
        ].join('');
      }).join('');
    }

    function renderFacilitadorPinBlock() {
      const current = getFacilitadorById(state.facilitadoresUi.selectedFacilitadorId);
      return [
        '<section class="admin-alumnos-panel">',
          '<div class="admin-alumnos-panel-head"><div><h4>Resetear PIN</h4><div class="subtle">Genera un PIN temporal y cierra sesiones activas del facilitador.</div></div></div>',
          '<div class="admin-alumnos-editor-grid">',
            '<label class="field admin-alumnos-field-full">',
              '<span>Nuevo PIN</span>',
              '<input id="adminFacilitadorResetPinInput" type="password" maxlength="20" placeholder="Nuevo PIN temporal para ' + escapeHtml((current && current.nombre_mostrado) || '') + '">',
            '</label>',
          '</div>',
          '<div class="actions compact admin-alumnos-panel-actions">',
            '<button class="btn-ghost" type="button" onclick="closeFacilitadorPinPanel()">Cancelar</button>',
            '<button class="btn-primary" type="button" onclick="saveFacilitadorPin(this)">Guardar PIN</button>',
          '</div>',
        '</section>'
      ].join('');
    }

    function renderFacilitadorAsignacionEditor() {
      const asign = state.facilitadoresUi.asignacion || createEmptyFacilitadorAsignacionState();
      const esTaller = !!(asign.taller_id || asign.tipo === 'taller');
      return [
        '<section id="adminFacilitadorAsignacionEditorPanel" class="admin-alumnos-panel">',
          '<div class="admin-alumnos-panel-head"><div><h4>' + escapeHtml(asign.asignacion_id ? 'Editar asignaci\u00f3n' : 'Nueva asignaci\u00f3n') + '</h4><div class="subtle">Define grupo+materia o taller y vigencia para medir el cumplimiento semanal.</div></div></div>',
          '<div class="admin-alumnos-mini-grid">',
            '<label class="field admin-alumnos-field-full">',
              '<span>Tipo de asignaci\u00f3n</span>',
              '<select id="adminFacilitadorAsignacionTipo" onchange="onFacilitadorAsignacionTipoChange(this.value)">',
                '<option value="grupo"' + (!esTaller ? ' selected' : '') + '>Grupo + Materia</option>',
                '<option value="taller"' + (esTaller ? ' selected' : '') + '>Taller</option>',
              '</select>',
            '</label>',
            '<div id="adminFacilitadorAsignacionGrupoBlock"' + (esTaller ? ' style="display:none"' : '') + '>',
              '<label class="field">',
                '<span>Grupo</span>',
                '<select id="adminFacilitadorAsignacionGrupo"></select>',
              '</label>',
            '</div>',
            '<div id="adminFacilitadorAsignacionMateriaBlock"' + (esTaller ? ' style="display:none"' : '') + '>',
              '<label class="field">',
                '<span>Materia</span>',
                '<select id="adminFacilitadorAsignacionMateria"></select>',
              '</label>',
            '</div>',
            '<div id="adminFacilitadorAsignacionTallerBlock"' + (!esTaller ? ' style="display:none"' : '') + '>',
              '<label class="field">',
                '<span>Taller</span>',
                '<select id="adminFacilitadorAsignacionTaller"></select>',
              '</label>',
            '</div>',
            '<label class="field">',
              '<span>Fecha de inicio</span>',
              '<input id="adminFacilitadorAsignacionInicio" type="date">',
            '</label>',
            '<label class="field">',
              '<span>Fecha de fin</span>',
              '<input id="adminFacilitadorAsignacionFin" type="date">',
            '</label>',
          '</div>',
          '<div class="actions compact admin-alumnos-panel-actions">',
            '<button class="btn-ghost" type="button" onclick="closeFacilitadorAsignacionPanel()">Cancelar</button>',
            '<button class="btn-primary" type="button" onclick="saveFacilitadorAsignacion(this)">Guardar asignaci&oacute;n</button>',
          '</div>',
        '</section>'
      ].join('');
    }

    function onFacilitadorAsignacionTipoChange(tipo) {
      const grupoBlock = $('adminFacilitadorAsignacionGrupoBlock');
      const materiaBlock = $('adminFacilitadorAsignacionMateriaBlock');
      const tallerBlock = $('adminFacilitadorAsignacionTallerBlock');
      if (!grupoBlock || !materiaBlock || !tallerBlock) return;
      const esTaller = tipo === 'taller';
      grupoBlock.style.display   = esTaller ? 'none' : '';
      materiaBlock.style.display = esTaller ? 'none' : '';
      tallerBlock.style.display  = esTaller ? '' : 'none';
    }

    function renderFacilitadorMatrix(facilitadorId) {
      const semanas = getFacilitadorRecentWeeks();
      const asignaciones = getFacilitadorAsignaciones(facilitadorId).filter((row) => row.activa);
      if (!asignaciones.length) {
        return '<div class="admin-alumnos-empty" style="min-height:160px;"><div><strong>Sin asignaciones activas.</strong><div class="subtle">Agrega grupo y materia para medir faltantes con confianza.</div></div></div>';
      }
      if (!semanas.length) {
        return '<div class="admin-alumnos-empty" style="min-height:160px;"><div><strong>No hay matriz disponible todav&iacute;a.</strong><div class="subtle">Necesitas semanas cargadas y al menos una asignaci&oacute;n activa.</div></div></div>';
      }
      if (isFacilitadorPulseDataLoading(facilitadorId)) {
        return '<div class="admin-alumnos-empty" style="min-height:160px;"><div><strong>Calculando pulso semanal...</strong><div class="subtle">Estamos cruzando asignaciones activas con planeaciones existentes.</div></div></div>';
      }
      if (state.facilitadoresUi && String(state.facilitadoresUi.pulsePlaneacionesError || '').trim()) {
        return '<div class="admin-alumnos-empty" style="min-height:160px;"><div><strong>No se pudo calcular el pulso.</strong><div class="subtle">' + escapeHtml(state.facilitadoresUi.pulsePlaneacionesError) + '</div></div></div>';
      }
      const legend = [
        ['is-ok', 'Lista'],
        ['is-missing', 'Falta'],
        ['is-alert', 'Alerta'],
        ['is-pending', 'Cierre'],
        ['is-closed', 'Cerrada']
      ].map((item) => (
        '<span class="admin-facilitadores-matrix-legend-item">' +
          '<span class="facilitador-matrix-state ' + item[0] + '">' + escapeHtml(item[1]) + '</span>' +
        '</span>'
      )).join('');
      return [
        '<div class="admin-facilitadores-matrix-summary">',
          '<span class="admin-facilitadores-matrix-legend">' + legend + '</span>',
        '</div>',
        '<div class="admin-facilitadores-matrix-table">',
          '<div class="admin-facilitadores-matrix-header">',
            '<div class="admin-facilitadores-matrix-label">Asignaci&oacute;n</div>',
            semanas.map((semana) => {
              const currentClass = isCurrentSemana(semana) ? ' is-current-week' : '';
              const title = isCurrentSemana(semana) ? 'Semana actual' : '';
              return '<div class="admin-facilitadores-matrix-cell' + currentClass + '"' + (title ? ' title="' + escapeHtml(title) + '"' : '') + '>' + escapeHtml(formatSemanaLabel(semana)) + '</div>';
            }).join(''),
          '</div>',
          asignaciones.map((asignacion) => {
            let matrixLabel;
            if (asignacion.taller_id) {
              const taller = (state.catalogos.talleres_admin || state.catalogos.talleres || []).find((t) => t.taller_id === asignacion.taller_id);
              matrixLabel = 'Taller: ' + ((taller && taller.nombre) || asignacion.taller_id);
            } else {
              const materia = (state.catalogos.materias || []).find((item) => item.materia_id === asignacion.materia_id);
              matrixLabel = getGrupoNombre(asignacion.grupo_id) + ' · ' + ((materia && materia.nombre) || asignacion.materia_id);
            }
            return [
              '<div class="admin-facilitadores-matrix-row">',
                '<div class="admin-facilitadores-matrix-label">' + escapeHtml(matrixLabel) + '</div>',
                semanas.map((semana) => {
                  const cell = getFacilitadorMatrixCellState(facilitadorId, asignacion, semana);
                  const css = cell.code === 'ok' ? 'is-ok' :
                    cell.code === 'alert' ? 'is-alert' :
                    cell.code === 'pending' ? 'is-pending' :
                    cell.code === 'closed' ? 'is-closed' :
                    'is-missing';
                  return '<div class="admin-facilitadores-matrix-cell"><span class="facilitador-matrix-state ' + css + '" title="' + escapeHtml(cell.title) + '">' + escapeHtml(cell.label) + '</span></div>';
                }).join(''),
              '</div>'
            ].join('');
          }).join(''),
        '</div>'
      ].join('');
    }

    function renderFacilitadorEditorPanel() {
      const panel = $('adminFacilitadorEditorPanel');
      if (!panel) return;
      panel.hidden = !state.facilitadoresUi.editorOpen;
      if (panel.hidden) return;
      const mode = state.facilitadoresUi.editorMode || 'new';
      const editor = state.facilitadoresUi.editor || createEmptyFacilitadorEditorState();
      if ($('adminFacilitadorEditorTitle')) $('adminFacilitadorEditorTitle').textContent = mode === 'edit' ? 'Editar facilitador' : 'Nuevo facilitador';
      if ($('adminFacilitadorIdInput')) {
        $('adminFacilitadorIdInput').value = editor.facilitador_id || '';
        $('adminFacilitadorIdInput').disabled = mode === 'edit';
      }
      if ($('adminFacilitadorNombreCompletoInput')) $('adminFacilitadorNombreCompletoInput').value = editor.nombre_completo || '';
      if ($('adminFacilitadorNombreMostradoInput')) $('adminFacilitadorNombreMostradoInput').value = editor.nombre_mostrado || '';
      if ($('adminFacilitadorRolInput')) $('adminFacilitadorRolInput').value = editor.rol || 'facilitador';
      if ($('adminFacilitadorColorInput')) $('adminFacilitadorColorInput').value = editor.color_ui || '';
      if ($('adminFacilitadorActivoInput')) $('adminFacilitadorActivoInput').value = editor.activo ? 'si' : 'no';
      if ($('adminFacilitadorPinInput')) $('adminFacilitadorPinInput').value = editor.pin_plano || '';
    }

    function bindAdminFacilitadoresEvents() {
      if ($('adminFacilitadoresSearch')) $('adminFacilitadoresSearch').addEventListener('input', (event) => {
        state.facilitadoresUi.search = event.currentTarget.value;
        scheduleUiDebounce('admin-facilitadores-search', () => renderAdminFacilitadoresModule());
      });
      if ($('adminFacilitadoresFilterAllBtn')) $('adminFacilitadoresFilterAllBtn').addEventListener('click', () => {
        state.facilitadoresUi.filter = 'todos';
        renderAdminFacilitadoresModule();
      });
      if ($('adminFacilitadoresFilterActiveBtn')) $('adminFacilitadoresFilterActiveBtn').addEventListener('click', () => {
        state.facilitadoresUi.filter = 'activos';
        renderAdminFacilitadoresModule();
      });
      if ($('adminFacilitadoresFilterInactiveBtn')) $('adminFacilitadoresFilterInactiveBtn').addEventListener('click', () => {
        state.facilitadoresUi.filter = 'inactivos';
        renderAdminFacilitadoresModule();
      });
      if ($('adminFacilitadoresFilterArchivedBtn')) $('adminFacilitadoresFilterArchivedBtn').addEventListener('click', () => {
        state.facilitadoresUi.filter = 'archivados';
        renderAdminFacilitadoresModule();
      });
      if ($('adminFacilitadorNewBtn')) $('adminFacilitadorNewBtn').addEventListener('click', () => openFacilitadorEditor('new'));
      if ($('adminFacilitadorCancelBtn')) $('adminFacilitadorCancelBtn').addEventListener('click', () => {
        closeFacilitadorEditor();
        renderAdminFacilitadoresModule();
      });
      if ($('adminFacilitadorSaveBtn')) $('adminFacilitadorSaveBtn').addEventListener('click', (event) => saveFacilitadorEditor(event.currentTarget));
    }

    function openFacilitadorPanel(facilitadorId) {
      state.facilitadoresUi.selectedFacilitadorId = String(facilitadorId || '').trim();
      state.facilitadoresUi.panelMode = 'detail';
      closeFacilitadorEditor();
      renderAdminFacilitadoresModule();
      focusAdminFacilitadorPanel('adminFacilitadorDetailPanel');
    }

    function focusAdminFacilitadorPanel(panelId, fieldId) {
      window.requestAnimationFrame(() => {
        const panel = $(panelId);
        if (!panel || panel.hidden || typeof panel.scrollIntoView !== 'function') return;
        panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.setTimeout(() => {
          const firstField = fieldId ? $(fieldId) : null;
          if (firstField && typeof firstField.focus === 'function') {
            firstField.focus({ preventScroll: true });
            if (typeof firstField.select === 'function' && !firstField.disabled) {
              firstField.select();
            }
          }
        }, 180);
      });
    }

    function openFacilitadorEditor(mode, facilitadorId) {
      const nextMode = mode === 'edit' ? 'edit' : 'new';
      const facilitador = nextMode === 'edit' ? getFacilitadorById(facilitadorId) : null;
      state.facilitadoresUi.editorMode = nextMode;
      state.facilitadoresUi.editorOpen = true;
      state.facilitadoresUi.selectedFacilitadorId = facilitador ? facilitador.facilitador_id : state.facilitadoresUi.selectedFacilitadorId;
      state.facilitadoresUi.editor = facilitador ? {
        facilitador_id: facilitador.facilitador_id,
        nombre_completo: facilitador.nombre_completo || '',
        nombre_mostrado: facilitador.nombre_mostrado || '',
        rol: facilitador.rol || 'facilitador',
        color_ui: facilitador.color_ui || '',
        activo: facilitador.activo,
        pin_plano: ''
      } : createEmptyFacilitadorEditorState();
      renderAdminFacilitadoresModule();
      focusAdminFacilitadorPanel(
        'adminFacilitadorEditorPanel',
        nextMode === 'edit' ? 'adminFacilitadorNombreCompletoInput' : 'adminFacilitadorIdInput'
      );
    }

    async function saveFacilitadorEditor(button) {
      const mode = state.facilitadoresUi.editorMode || 'new';
      const payload = {
        facilitador_id: $('adminFacilitadorIdInput') ? $('adminFacilitadorIdInput').value.trim() : '',
        nombre_completo: $('adminFacilitadorNombreCompletoInput') ? $('adminFacilitadorNombreCompletoInput').value.trim() : '',
        nombre_mostrado: $('adminFacilitadorNombreMostradoInput') ? $('adminFacilitadorNombreMostradoInput').value.trim() : '',
        rol: $('adminFacilitadorRolInput') ? $('adminFacilitadorRolInput').value : 'facilitador',
        color_ui: $('adminFacilitadorColorInput') ? $('adminFacilitadorColorInput').value.trim() : '',
        activo: $('adminFacilitadorActivoInput') ? $('adminFacilitadorActivoInput').value === 'si' : true,
        request_id: uid('FACED')
      };
      const pinPlano = $('adminFacilitadorPinInput') ? $('adminFacilitadorPinInput').value.trim() : '';
      await handleAction('guardarFacilitador', async () => {
        if (!canManageFacilitadoresCatalog()) throw new Error('Solo admin puede editar facilitadores.');
        if (!payload.facilitador_id) throw new Error('Captura el Facilitador ID.');
        if (!payload.nombre_completo) throw new Error('Captura el nombre completo.');
        if (!payload.nombre_mostrado) throw new Error('Captura el nombre mostrado.');
        if (mode === 'new' && !pinPlano) throw new Error('Captura un PIN temporal para el nuevo facilitador.');
        if (pinPlano) payload.pin_plano = pinPlano;
        const data = await api('guardarFacilitador', payload);
        if (data && data.facilitador) applySavedFacilitadorCatalogRow(data.facilitador);
        closeFacilitadorEditor();
        state.facilitadoresUi.selectedFacilitadorId = data.facilitador_id || payload.facilitador_id;
        renderAdminModuleSurface('facilitadores');
        setBanner(mode === 'new' ? 'Facilitador creado.' : 'Ficha del facilitador actualizada.', 'success');
      }, {
        button,
        key: buildActionKey('guardarFacilitador', [payload.facilitador_id, mode]),
        busyText: mode === 'new' ? 'Creando...' : 'Guardando...'
      });
    }

    function openFacilitadorPin(facilitadorId) {
      state.facilitadoresUi.selectedFacilitadorId = String(facilitadorId || '').trim();
      state.facilitadoresUi.pinOpen = true;
      state.facilitadoresUi.pinValue = '';
      renderAdminFacilitadoresModule();
      focusAdminFacilitadorPanel('adminFacilitadorDetailPanel', 'adminFacilitadorResetPinInput');
    }

    function closeFacilitadorPinPanel() {
      closeFacilitadorPin();
      renderAdminFacilitadoresModule();
    }

    async function saveFacilitadorPin(button) {
      if (!canManageFacilitadoresCatalog()) throw new Error('Solo admin puede resetear PIN.');
      const facilitadorId = String(state.facilitadoresUi.selectedFacilitadorId || '').trim();
      const pinPlano = $('adminFacilitadorResetPinInput') ? $('adminFacilitadorResetPinInput').value.trim() : '';
      if (!facilitadorId) throw new Error('Selecciona un facilitador.');
      if (!pinPlano) throw new Error('Captura un nuevo PIN.');
      await handleAction('resetearPinFacilitador', async () => {
        await api('guardarFacilitador', {
          facilitador_id: facilitadorId,
          pin_plano: pinPlano,
          request_id: uid('FACPIN')
        });
        closeFacilitadorPin();
        renderAdminModuleSurface('facilitadores');
        setBanner('PIN restablecido para el facilitador.', 'success');
      }, {
        button,
        key: buildActionKey('resetearPinFacilitador', [facilitadorId]),
        busyText: 'Guardando...'
      });
    }

    async function toggleFacilitadorActivo(button, facilitadorId, nextActive) {
      if (!canManageFacilitadoresCatalog()) throw new Error('Solo admin puede cambiar el estatus operativo del facilitador.');
      const row = getFacilitadorById(facilitadorId);
      if (!row) throw new Error('Facilitador no encontrado.');
      await handleAction('toggleFacilitadorActivo', async () => {
        await api('guardarFacilitador', {
          facilitador_id: row.facilitador_id,
          activo: !!nextActive,
          request_id: uid('FACTOG')
        });
        applyPatchedFacilitadorCatalogRow(row.facilitador_id, {
          activo: !!nextActive
        });
        renderAdminModuleSurface('facilitadores');
        setBanner(nextActive ? 'Facilitador activado.' : 'Facilitador desactivado.', 'success');
      }, {
        button,
        key: buildActionKey('toggleFacilitadorActivo', [facilitadorId, nextActive ? 'si' : 'no']),
        busyText: nextActive ? 'Activando...' : 'Desactivando...'
      });
    }

    async function archiveFacilitador(button, facilitadorId) {
      if (!canManageFacilitadoresCatalog()) throw new Error('Solo admin puede archivar facilitadores.');
      const row = getFacilitadorById(facilitadorId);
      if (!row) throw new Error('Facilitador no encontrado.');
      if (!confirm('Esto archivar\u00e1 al facilitador y cerrar\u00e1 sus accesos operativos.')) return;
      await handleAction('archivarFacilitador', async () => {
        await api('archivarFacilitador', {
          facilitador_id: row.facilitador_id,
          request_id: uid('FACARC')
        });
        const archivedAt = new Date().toISOString();
        applyPatchedFacilitadorCatalogRow(row.facilitador_id, {
          activo: false,
          fecha_baja: getTodayYmdLocal(),
          archivado_at: archivedAt,
          archivado_por: String(state.session && state.session.usuario && state.session.usuario.facilitador_id || '')
        });
        renderAdminModuleSurface('facilitadores');
        setBanner('Facilitador archivado.', 'success');
      }, {
        button,
        key: buildActionKey('archivarFacilitador', [facilitadorId]),
        busyText: 'Archivando...'
      });
    }

    async function reactivateFacilitador(button, facilitadorId) {
      if (!canManageFacilitadoresCatalog()) throw new Error('Solo admin puede reactivar facilitadores.');
      const row = getFacilitadorById(facilitadorId);
      if (!row) throw new Error('Facilitador no encontrado.');
      await handleAction('reactivarFacilitador', async () => {
        await api('reactivarFacilitador', {
          facilitador_id: row.facilitador_id,
          request_id: uid('FACREA')
        });
        applyPatchedFacilitadorCatalogRow(row.facilitador_id, {
          activo: true,
          fecha_baja: '',
          archivado_at: '',
          archivado_por: ''
        });
        renderAdminModuleSurface('facilitadores');
        setBanner('Facilitador reactivado.', 'success');
      }, {
        button,
        key: buildActionKey('reactivarFacilitador', [facilitadorId]),
        busyText: 'Reactivando...'
      });
    }

    function openFacilitadorAsignacionEditor(mode, asignacionId) {
      const facilitadorId = String(state.facilitadoresUi.selectedFacilitadorId || '').trim();
      if (!facilitadorId) return;
      const current = mode === 'edit'
        ? getFacilitadorAsignaciones(facilitadorId, { includeArchived: true }).find((row) => row.asignacion_id === String(asignacionId || '').trim())
        : null;
      state.facilitadoresUi.asignacionOpen = true;
      state.facilitadoresUi.asignacion = current ? {
        asignacion_id: current.asignacion_id,
        facilitador_id: current.facilitador_id,
        grupo_id: current.grupo_id,
        materia_id: current.materia_id,
        taller_id: current.taller_id || '',
        tipo: current.taller_id ? 'taller' : 'grupo',
        activa: current.activa,
        fecha_inicio: current.fecha_inicio || '',
        fecha_fin: current.fecha_fin || ''
      } : {
        asignacion_id: '',
        facilitador_id: facilitadorId,
        grupo_id: '',
        materia_id: '',
        taller_id: '',
        tipo: 'grupo',
        activa: true,
        fecha_inicio: '',
        fecha_fin: ''
      };
      renderAdminFacilitadoresModule();
      const talleresCat = (state.catalogos.talleres_admin || state.catalogos.talleres || []).filter((t) => {
        if (!t || String(t.archivado_at || '').trim()) return false;
        return String(t.facilitador_id || '').trim() === facilitadorId;
      });
      fillSelect($('adminFacilitadorAsignacionGrupo'), state.catalogos.grupos || [], (item) => item.grupo_id, (item) => getGrupoDisplayName(item), 'Selecciona grupo');
      fillSelect($('adminFacilitadorAsignacionMateria'), state.catalogos.materias || [], (item) => item.materia_id, (item) => item.nombre || item.materia_id, 'Selecciona materia');
      fillSelect($('adminFacilitadorAsignacionTaller'), talleresCat, (item) => item.taller_id, (item) => item.nombre || item.taller_id, 'Selecciona taller');
      if ($('adminFacilitadorAsignacionGrupo')) $('adminFacilitadorAsignacionGrupo').value = state.facilitadoresUi.asignacion.grupo_id || '';
      if ($('adminFacilitadorAsignacionMateria')) $('adminFacilitadorAsignacionMateria').value = state.facilitadoresUi.asignacion.materia_id || '';
      if ($('adminFacilitadorAsignacionTaller')) $('adminFacilitadorAsignacionTaller').value = state.facilitadoresUi.asignacion.taller_id || '';
      if ($('adminFacilitadorAsignacionInicio')) $('adminFacilitadorAsignacionInicio').value = state.facilitadoresUi.asignacion.fecha_inicio || '';
      if ($('adminFacilitadorAsignacionFin')) $('adminFacilitadorAsignacionFin').value = state.facilitadoresUi.asignacion.fecha_fin || '';
      focusAdminFacilitadorPanel('adminFacilitadorAsignacionEditorPanel', 'adminFacilitadorAsignacionTipo');
    }

    function closeFacilitadorAsignacionPanel() {
      closeFacilitadorAsignacionEditor();
      renderAdminFacilitadoresModule();
    }

    async function saveFacilitadorAsignacion(button) {
      const facilitadorId = String(state.facilitadoresUi.selectedFacilitadorId || '').trim();
      const tipo = $('adminFacilitadorAsignacionTipo') ? $('adminFacilitadorAsignacionTipo').value : 'grupo';
      const esTaller = tipo === 'taller';
      const payload = {
        asignacion_id: state.facilitadoresUi.asignacion.asignacion_id || '',
        facilitador_id: facilitadorId,
        grupo_id:   esTaller ? '' : ($('adminFacilitadorAsignacionGrupo') ? $('adminFacilitadorAsignacionGrupo').value : ''),
        materia_id: esTaller ? '' : ($('adminFacilitadorAsignacionMateria') ? $('adminFacilitadorAsignacionMateria').value : ''),
        taller_id:  esTaller ? ($('adminFacilitadorAsignacionTaller') ? $('adminFacilitadorAsignacionTaller').value : '') : '',
        fecha_inicio: $('adminFacilitadorAsignacionInicio') ? $('adminFacilitadorAsignacionInicio').value : '',
        fecha_fin: $('adminFacilitadorAsignacionFin') ? $('adminFacilitadorAsignacionFin').value : '',
        activa: true,
        request_id: uid('FAS')
      };
      await handleAction('guardarFacilitadorAsignacion', async () => {
        if (!facilitadorId) throw new Error('Selecciona un facilitador.');
        if (esTaller) {
          if (!payload.taller_id) throw new Error('Selecciona un taller.');
        } else {
          if (!payload.grupo_id) throw new Error('Selecciona un grupo.');
          if (!payload.materia_id) throw new Error('Selecciona una materia.');
        }
        const data = await api('guardarFacilitadorAsignacion', payload);
        applySavedFacilitadorAsignacionCatalogRow({
          asignacion_id: data && data.asignacion_id ? data.asignacion_id : (payload.asignacion_id || uid('FASLOCAL')),
          facilitador_id: facilitadorId,
          grupo_id:   payload.grupo_id,
          materia_id: payload.materia_id,
          taller_id:  payload.taller_id,
          activa: true,
          fecha_inicio: payload.fecha_inicio || '',
          fecha_fin: payload.fecha_fin || '',
          fecha_actualizacion: new Date().toISOString(),
          archivado_at: '',
          archivada_at: '',
          archivado_por: '',
          archivada_por: ''
        });
        closeFacilitadorAsignacionEditor();
        renderAdminModuleSurface('facilitadores');
        setBanner('Asignaci\u00f3n guardada.', 'success');
      }, {
        button,
        key: buildActionKey('guardarFacilitadorAsignacion', [facilitadorId, payload.taller_id || payload.grupo_id, payload.materia_id || '', payload.asignacion_id || 'new']),
        busyText: 'Guardando...'
      });
    }

    async function archiveFacilitadorAsignacion(button, asignacionId) {
      if (!confirm('Esta asignaci\u00f3n dejar\u00e1 de contar para el pulso semanal del facilitador.')) return;
      await handleAction('archivarFacilitadorAsignacion', async () => {
        await api('archivarFacilitadorAsignacion', {
          asignacion_id: asignacionId,
          request_id: uid('FASARC')
        });
        const archivedAt = new Date().toISOString();
        applySavedFacilitadorAsignacionCatalogRow({
          asignacion_id: asignacionId,
          activa: false,
          fecha_fin: getTodayYmdLocal(),
          fecha_actualizacion: archivedAt,
          archivado_at: archivedAt,
          archivada_at: archivedAt,
          archivado_por: String(state.session && state.session.usuario && state.session.usuario.facilitador_id || ''),
          archivada_por: String(state.session && state.session.usuario && state.session.usuario.facilitador_id || '')
        });
        closeFacilitadorAsignacionEditor();
        renderAdminModuleSurface('facilitadores');
        setBanner('Asignaci\u00f3n retirada del pulso semanal.', 'success', { anchor: null });
      }, {
        button,
        key: buildActionKey('archivarFacilitadorAsignacion', [asignacionId]),
        busyText: 'Quitando...'
      });
    }

    async function openFacilitadorPlaneaciones(facilitadorId, grupoId, materiaId) {
      activateAdminModule('planeaciones');
      if ($('filterFacilitador')) $('filterFacilitador').value = String(facilitadorId || '').trim();
      if ($('filterGrupo') && grupoId !== undefined) $('filterGrupo').value = String(grupoId || '').trim();
      if (state.ui) state.ui.planeacionesMateriaFilter = materiaId !== undefined ? String(materiaId || '').trim() : '';
      renderPlaneacionesSurface({
        includeStats: false,
        includePlaneaciones: true,
        includeAlertas: false
      });
      await refreshPlaneaciones();
      renderPlaneacionesSurface({
        includeStats: false,
        includePlaneaciones: true,
        includeAlertas: false
      });
      setBanner(
        state.ui && state.ui.planeacionesMateriaFilter
          ? 'Planeaciones filtradas por asignaci\u00f3n del facilitador.'
          : 'Planeaciones filtradas por facilitador.',
        'info'
      );
    }

    function canManageTalleresCatalog() {
      return canUseAdminShell();
    }

    function getAdminTalleresCatalog() {
      const revision = getCatalogosRevision();
      if (adminCatalogMemo.talleres.revision === revision) {
        return adminCatalogMemo.talleres.result;
      }
      const rows = Array.isArray(state.catalogos.talleres_admin) && state.catalogos.talleres_admin.length
        ? state.catalogos.talleres_admin
        : (state.catalogos.talleres || []);
      const result = rows.map((row) => ({
        taller_id: String(row.taller_id || '').trim(),
        nombre: String(row.nombre || '').trim(),
        materia_id: String(row.materia_id || '').trim(),
        facilitador_id: String(row.facilitador_id || '').trim(),
        activo: !!row.activo,
        estatus: String(row.estatus || '').trim() || (row.activo ? 'activo' : 'inactivo'),
        fecha_actualizacion: String(row.fecha_actualizacion || '').trim(),
        archivado_at: String(row.archivado_at || '').trim(),
        archivado_por: String(row.archivado_por || '').trim()
      }));
      adminCatalogMemo.talleres = {
        revision,
        result,
        byId: new Map(result.map((row) => [row.taller_id, row]))
      };
      return result;
    }

    function getTallerById(tallerId) {
      const id = String(tallerId || '').trim();
      if (!id) return null;
      getAdminTalleresCatalog();
      return adminCatalogMemo.talleres.byId.get(id) || null;
    }

    function applySavedTallerCatalogRow(row) {
      if (!row || !row.taller_id) return null;
      upsertCatalogEntityRow('talleres_admin', 'taller_id', row);
      upsertCatalogEntityRow('talleres', 'taller_id', row);
      return getTallerById(row.taller_id);
    }

    function getTallerStatusLabel(status) {
      if (status === 'archivado') return 'Archivado';
      if (status === 'inactivo') return 'Inactivo';
      return 'Activo';
    }

    function getTallerStatusBadgeClass(status) {
      if (status === 'archivado') return 'is-archived';
      if (status === 'inactivo') return 'is-inactive';
      return 'is-active';
    }

    function closeTallerEditor() {
      state.talleresUi.editorOpen = false;
      state.talleresUi.editorMode = 'new';
      state.talleresUi.editor = createEmptyTallerEditorState();
    }

    function closeTallerMembershipEditor() {
      state.talleresUi.membershipOpen = false;
      state.talleresUi.membershipSearch = '';
      state.talleresUi.membershipGroup = '';
      state.talleresUi.membershipSelectedAlumnoIds = [];
    }

    function syncAdminTalleresModule() {
      const visible = getVisibleTalleres();
      const selected = String(state.talleresUi.selectedTallerId || '').trim();
      if (selected && visible.some((row) => row.taller_id === selected)) return;
      state.talleresUi.selectedTallerId = visible.length ? visible[0].taller_id : '';
      if (!visible.length) {
        closeTallerEditor();
        closeTallerMembershipEditor();
      }
    }

    function getTallerSearchText(row) {
      const materia = (state.catalogos.materias || []).find((item) => item.materia_id === row.materia_id);
      const facilitador = getFacilitadorById(row.facilitador_id);
      return [
        row.taller_id,
        row.nombre,
        row.materia_id,
        materia && materia.nombre,
        row.facilitador_id,
        facilitador && (facilitador.nombre_mostrado || facilitador.nombre_completo)
      ].filter(Boolean).join(' ').toLowerCase();
    }

    function getVisibleTalleres() {
      const filter = String(state.talleresUi.filter || 'activos').trim();
      const query = String(state.talleresUi.search || '').trim().toLowerCase();
      return getAdminTalleresCatalog()
        .filter((row) => {
          const status = String(row.estatus || '').trim();
          if (filter === 'activos' && status !== 'activo') return false;
          if (filter === 'inactivos' && status !== 'inactivo') return false;
          if (filter === 'archivados' && status !== 'archivado') return false;
          if (!query) return true;
          return getTallerSearchText(row).includes(query);
        })
        .sort((a, b) => String(a.nombre || a.taller_id).localeCompare(String(b.nombre || b.taller_id), 'es'));
    }

    function getTalleresKpis() {
      const rows = getAdminTalleresCatalog();
      return {
        total: rows.length,
        activos: rows.filter((row) => row.estatus === 'activo').length,
        inactivos: rows.filter((row) => row.estatus === 'inactivo').length,
        archivados: rows.filter((row) => row.estatus === 'archivado').length
      };
    }

    function getTallerMateriaOptions() {
      return (state.catalogos.materias || []).filter((row) => String(row.estatus || '').trim() !== 'archivada');
    }

    function getTallerFacilitadorOptions() {
      const rows = Array.isArray(state.catalogos.facilitadores_admin) && state.catalogos.facilitadores_admin.length
        ? state.catalogos.facilitadores_admin
        : (state.catalogos.facilitadores || []);
      return rows.filter((row) => String(row.archivado_at || '').trim() === '');
    }

    function getActiveTallerAlumnoRows(tallerId) {
      const targetId = String(tallerId || '').trim();
      if (!targetId) return [];
      return (state.catalogos.alumno_talleres || [])
        .filter((row) => String(row.taller_id || '').trim() === targetId && row.activa !== false)
        .map((row) => {
          const alumno = getAlumnoById(row.alumno_id);
          return Object.assign({}, row, { alumno: alumno || null });
        })
        .sort((a, b) => String((a.alumno && (a.alumno.nombre_mostrado || a.alumno.nombre_completo)) || '').localeCompare(String((b.alumno && (b.alumno.nombre_mostrado || b.alumno.nombre_completo)) || ''), 'es'));
    }

    function getTallerAlumnoIds(tallerId) {
      return getActiveTallerAlumnoRows(tallerId).map((row) => String(row.alumno_id || '').trim());
    }

    function getTallerCandidateAlumnos() {
      return (state.catalogos.alumnos || [])
        .filter((row) => getAlumnoStatusVisual(row) === 'activo')
        .map((row) => Object.assign({}, row, { grupo_nombre: getGrupoNombre(row.grupo_id) }))
        .sort((a, b) => {
          const groupDiff = String(a.grupo_nombre || '').localeCompare(String(b.grupo_nombre || ''), 'es');
          if (groupDiff) return groupDiff;
          return String(a.nombre_mostrado || a.nombre_completo || a.alumno_id).localeCompare(String(b.nombre_mostrado || b.nombre_completo || b.alumno_id), 'es');
        });
    }

    function getVisibleTallerCandidateAlumnos() {
      const query = String(state.talleresUi.membershipSearch || '').trim().toLowerCase();
      const groupFilter = String(state.talleresUi.membershipGroup || '').trim();
      return getTallerCandidateAlumnos().filter((row) => {
        if (groupFilter && String(row.grupo_id || '').trim() !== groupFilter) return false;
        if (!query) return true;
        return [
          row.alumno_id,
          row.matricula,
          row.nombre_mostrado,
          row.nombre_completo,
          row.grupo_nombre
        ].filter(Boolean).join(' ').toLowerCase().includes(query);
      });
    }

    function renderTallerMembershipSelectionMarkup(visibleCandidates, selectedIds) {
      const selectedSet = selectedIds instanceof Set
        ? selectedIds
        : new Set((state.talleresUi.membershipSelectedAlumnoIds || []).map((item) => String(item || '').trim()).filter(Boolean));
      const rows = Array.isArray(visibleCandidates) ? visibleCandidates : getVisibleTallerCandidateAlumnos();
      return [
        '<div class="subtle">' + escapeHtml(String(selectedSet.size)) + ' alumno(s) seleccionado(s). Desmarca para quitar del taller.</div>',
        (rows.length
          ? '<div class="checklist admin-taller-membership-candidates">' + rows.map((row) => {
              const alumnoId = String(row.alumno_id || '').trim();
              return '<label class="admin-taller-membership-candidate">' +
                '<input type="checkbox" value="' + escapeHtml(alumnoId) + '" ' + (selectedSet.has(alumnoId) ? 'checked' : '') + ' onchange="toggleTallerAlumnoDraft(\'' + escapeJsAttrValue(alumnoId) + '\', this.checked)">' +
                '<span><strong>' + escapeHtml(row.nombre_mostrado || row.nombre_completo || alumnoId) + '</strong><span class="mini">' + escapeHtml((row.matricula || 'Sin matr\u00edcula') + ' - ' + getGrupoNombre(row.grupo_id)) + '</span></span>' +
              '</label>';
            }).join('') + '</div>'
          : '<div class="admin-alumnos-empty" style="min-height:132px;"><div><strong>No hay alumnos para esta b&uacute;squeda.</strong><div class="subtle">Ajusta el grupo o el texto para seguir inscribiendo.</div></div></div>')
      ].join('');
    }

    function refreshTallerMembershipCandidateList() {
      const host = $('adminTallerMembershipCandidateList');
      if (!host) {
        renderAdminTalleresModule();
        return;
      }
      const selectedIds = new Set((state.talleresUi.membershipSelectedAlumnoIds || []).map((item) => String(item || '').trim()).filter(Boolean));
      host.innerHTML = renderTallerMembershipSelectionMarkup(getVisibleTallerCandidateAlumnos(), selectedIds);
    }

    function replaceTallerAlumnoRelations(tallerId, activeRows) {
      const targetId = String(tallerId || '').trim();
      const nextRows = Array.isArray(activeRows) ? activeRows.slice() : [];
      state.catalogos.alumno_talleres = (state.catalogos.alumno_talleres || []).filter((row) => String(row.taller_id || '').trim() !== targetId);
      nextRows.forEach((row) => state.catalogos.alumno_talleres.push(row));
    }

    async function openTallerMembershipEditor(tallerId) {
      const targetId = String(tallerId || state.talleresUi.selectedTallerId || '').trim();
      const taller = getTallerById(targetId);
      if (!taller) return;
      closeTallerEditor();
      state.talleresUi.selectedTallerId = targetId;
      state.talleresUi.membershipOpen = true;
      state.talleresUi.membershipSearch = '';
      state.talleresUi.membershipGroup = '';
      state.talleresUi.membershipSelectedAlumnoIds = getTallerAlumnoIds(targetId);
      renderAdminTalleresModule();
      await ensureTallerMembershipCatalogosAvailable();
      focusAdminFacilitadorPanel('adminTallerDetailPanel', 'adminTallerMembershipSearch');
    }

    function toggleTallerAlumnoDraft(alumnoId, checked) {
      const id = String(alumnoId || '').trim();
      if (!id) return;
      const selected = new Set((state.talleresUi.membershipSelectedAlumnoIds || []).map((item) => String(item || '').trim()).filter(Boolean));
      if (checked) selected.add(id);
      else selected.delete(id);
      state.talleresUi.membershipSelectedAlumnoIds = Array.from(selected);
      refreshTallerMembershipCandidateList();
    }

    function toggleAllVisibleTallerAlumnos(nextChecked) {
      const selected = new Set((state.talleresUi.membershipSelectedAlumnoIds || []).map((item) => String(item || '').trim()).filter(Boolean));
      getVisibleTallerCandidateAlumnos().forEach((row) => {
        const id = String(row.alumno_id || '').trim();
        if (!id) return;
        if (nextChecked) selected.add(id);
        else selected.delete(id);
      });
      state.talleresUi.membershipSelectedAlumnoIds = Array.from(selected);
      refreshTallerMembershipCandidateList();
    }

    function getAdminTalleresModuleTemplate() {
      return [
        '<article class="admin-toolbar admin-alumnos-module admin-talleres-module">',
          '<div class="admin-toolbar-head admin-alumnos-head">',
            '<div class="admin-alumnos-head-copy">',
              '<h3>Talleres</h3>',
              '<p class="subtle">Administra el cat&aacute;logo base de talleres antes de asignar alumnos o crear planeaciones por taller.</p>',
            '</div>',
            '<div class="admin-alumnos-head-actions">',
              '<label class="admin-alumnos-search" for="adminTalleresSearch">',
                '<span>Buscar</span>',
                '<input id="adminTalleresSearch" type="search" placeholder="Buscar por ID, nombre o responsable">',
              '</label>',
              '<button id="adminTallerNewBtn" class="btn-primary" type="button">Nuevo taller</button>',
            '</div>',
          '</div>',
          '<div class="admin-materias-kpis">',
            '<div class="admin-materias-kpi"><strong id="adminTalleresKpiTotal">0</strong><span>Total talleres</span></div>',
            '<div class="admin-materias-kpi"><strong id="adminTalleresKpiActive">0</strong><span>Activos</span></div>',
            '<div class="admin-materias-kpi"><strong id="adminTalleresKpiInactive">0</strong><span>Inactivos</span></div>',
            '<div class="admin-materias-kpi"><strong id="adminTalleresKpiArchived">0</strong><span>Archivados</span></div>',
          '</div>',
          '<div class="admin-alumnos-filterbar">',
            '<div class="admin-alumnos-filterchips">',
              '<button id="adminTalleresFilterAllBtn" class="btn-ghost" type="button">Todos</button>',
              '<button id="adminTalleresFilterActiveBtn" class="btn-ghost" type="button">Activos</button>',
              '<button id="adminTalleresFilterInactiveBtn" class="btn-ghost" type="button">Inactivos</button>',
              '<button id="adminTalleresFilterArchivedBtn" class="btn-ghost" type="button">Archivados</button>',
            '</div>',
          '</div>',
          '<div class="admin-alumnos-layout">',
            '<section class="admin-alumnos-main">',
              '<div class="admin-alumnos-section-head">',
                '<div>',
                  '<h4 id="adminTalleresListTitle">Talleres activos</h4>',
                  '<div id="adminTalleresListMeta" class="subtle">Cat&aacute;logo operativo base para futuros grupos mixtos.</div>',
                '</div>',
              '</div>',
              '<div id="adminTalleresList" class="admin-alumnos-list"></div>',
            '</section>',
            '<aside class="admin-alumnos-side">',
              '<section id="adminTallerDetailPanel" class="admin-alumnos-panel"></section>',
              '<section id="adminTallerEditorPanel" class="admin-alumnos-panel" hidden>',
                '<div class="admin-alumnos-panel-head">',
                  '<div>',
                    '<h4 id="adminTallerEditorTitle">Nuevo taller</h4>',
                    '<div class="subtle">Configura el taller base con su materia y facilitador responsable.</div>',
                  '</div>',
                '</div>',
                '<div class="admin-alumnos-editor-grid">',
                  '<label class="field">',
                    '<span>Taller ID</span>',
                    '<input id="adminTallerIdInput" type="text" maxlength="50" placeholder="Ej. TALL-001">',
                  '</label>',
                  '<label class="field">',
                    '<span>Estatus</span>',
                    '<select id="adminTallerStatusInput">',
                      '<option value="activo">Activo</option>',
                      '<option value="inactivo">Inactivo</option>',
                    '</select>',
                  '</label>',
                  '<label class="field admin-alumnos-field-full">',
                    '<span>Nombre</span>',
                    '<input id="adminTallerNombreInput" type="text" maxlength="100" placeholder="Ej. Taller de f&uacute;tbol">',
                  '</label>',
                  '<label class="field">',
                    '<span>Materia base</span>',
                    '<select id="adminTallerMateriaInput"></select>',
                  '</label>',
                  '<label class="field">',
                    '<span>Facilitador responsable</span>',
                    '<select id="adminTallerFacilitadorInput"></select>',
                  '</label>',
                '</div>',
                '<div class="actions compact admin-alumnos-panel-actions">',
                  '<button id="adminTallerCancelBtn" class="btn-ghost" type="button">Cancelar</button>',
                  '<button id="adminTallerSaveBtn" class="btn-primary" type="button">Guardar</button>',
                '</div>',
              '</section>',
            '</aside>',
          '</div>',
        '</article>'
      ].join('');
    }

    function renderAdminTalleresModule() {
      const panel = $('admin-panel-talleres');
      if (!panel || !canUseAdminShell()) return;
      if (panel.dataset.ready !== '1') {
        panel.innerHTML = getAdminTalleresModuleTemplate();
        panel.dataset.ready = '1';
        bindAdminTalleresEvents();
      }
      syncAdminTalleresModule();
      const kpis = getTalleresKpis();
      if ($('adminTalleresSearch')) $('adminTalleresSearch').value = state.talleresUi.search || '';
      if ($('adminTalleresKpiTotal')) $('adminTalleresKpiTotal').textContent = String(kpis.total);
      if ($('adminTalleresKpiActive')) $('adminTalleresKpiActive').textContent = String(kpis.activos);
      if ($('adminTalleresKpiInactive')) $('adminTalleresKpiInactive').textContent = String(kpis.inactivos);
      if ($('adminTalleresKpiArchived')) $('adminTalleresKpiArchived').textContent = String(kpis.archivados);
      if ($('adminTalleresFilterAllBtn')) $('adminTalleresFilterAllBtn').classList.toggle('is-active', state.talleresUi.filter === 'todos');
      if ($('adminTalleresFilterActiveBtn')) $('adminTalleresFilterActiveBtn').classList.toggle('is-active', state.talleresUi.filter === 'activos');
      if ($('adminTalleresFilterInactiveBtn')) $('adminTalleresFilterInactiveBtn').classList.toggle('is-active', state.talleresUi.filter === 'inactivos');
      if ($('adminTalleresFilterArchivedBtn')) $('adminTalleresFilterArchivedBtn').classList.toggle('is-active', state.talleresUi.filter === 'archivados');
      renderAdminTalleresList();
      renderTallerDetailPanel();
      renderTallerEditorPanel();
    }

    function renderAdminTalleresList() {
      const host = $('adminTalleresList');
      if (!host) return;
      const rows = getVisibleTalleres();
      const filter = String(state.talleresUi.filter || 'activos').trim();
      if ($('adminTalleresListTitle')) $('adminTalleresListTitle').textContent = filter === 'todos' ? 'Todos los talleres' : (filter === 'archivados' ? 'Talleres archivados' : (filter === 'inactivos' ? 'Talleres inactivos' : 'Talleres activos'));
      if ($('adminTalleresListMeta')) $('adminTalleresListMeta').textContent = rows.length + ' taller(es) visibles en esta vista.';
      if (!rows.length) {
        host.innerHTML = '<div class="admin-alumnos-empty"><div><strong>No hay talleres para mostrar.</strong><div class="subtle">Crea el cat&aacute;logo base del taller para pasar despu&eacute;s a inscripciones y planeaciones.</div></div></div>';
        return;
      }
      host.innerHTML = [
        '<div class="admin-alumnos-table">',
          '<div class="admin-talleres-list-header">',
            '<div>ID</div>',
            '<div>Taller</div>',
            '<div>Materia</div>',
            '<div>Responsable</div>',
            '<div>Estado</div>',
            '<div>Acciones</div>',
          '</div>',
          rows.map((row) => {
            const selected = String(state.talleresUi.selectedTallerId || '').trim() === row.taller_id;
            const materia = (state.catalogos.materias || []).find((item) => item.materia_id === row.materia_id);
            const facilitador = getFacilitadorById(row.facilitador_id);
            return [
              '<article class="admin-talleres-row' + (selected ? ' is-selected' : '') + '" onclick="selectTaller(\'' + escapeJsAttrValue(row.taller_id) + '\')">',
                '<div class="admin-alumnos-cell"><div class="mini">' + escapeHtml(row.taller_id) + '</div></div>',
                '<div class="admin-alumnos-title"><strong>' + escapeHtml(row.nombre || row.taller_id) + '</strong><div class="mini">' + escapeHtml(row.archivado_at ? ('Archivado ' + formatFechaHumana(row.archivado_at)) : 'Listo para recibir alumnos despu\u00e9s') + '</div></div>',
                '<div class="admin-alumnos-cell"><div class="mini">' + escapeHtml((materia && materia.nombre) || 'Sin materia base') + '</div></div>',
                '<div class="admin-alumnos-cell"><div class="mini">' + escapeHtml((facilitador && (facilitador.nombre_mostrado || facilitador.nombre_completo)) || 'Sin responsable') + '</div></div>',
                '<div class="admin-alumnos-cell"><span class="admin-alumnos-badge ' + getTallerStatusBadgeClass(row.estatus) + '">' + escapeHtml(getTallerStatusLabel(row.estatus)) + '</span></div>',
                '<div class="admin-alumnos-actions"><button class="btn-ghost" type="button" onclick="event.stopPropagation(); openTallerEditor(\'edit\', \'' + escapeJsAttrValue(row.taller_id) + '\')">Editar</button></div>',
              '</article>'
            ].join('');
          }).join(''),
        '</div>'
      ].join('');
    }

    function renderTallerDetailPanel() {
      const host = $('adminTallerDetailPanel');
      if (!host) return;
      const taller = getTallerById(state.talleresUi.selectedTallerId);
      if (!taller) {
        host.innerHTML = '<div class="admin-alumnos-empty"><div><strong>Selecciona un taller</strong><div class="subtle">Aqu&iacute; ver&aacute;s su materia base, responsable y el acceso r&aacute;pido para editar el cat&aacute;logo.</div></div></div>';
        return;
      }
      const materia = (state.catalogos.materias || []).find((item) => item.materia_id === taller.materia_id);
      const facilitador = getFacilitadorById(taller.facilitador_id);
      const canManage = canManageTalleresCatalog();
      const activeMembers = getActiveTallerAlumnoRows(taller.taller_id);
      const representedGroups = Array.from(new Set(activeMembers.map((row) => String((row.alumno && row.alumno.grupo_id) || '').trim()).filter(Boolean)));
      const membershipOpen = !!state.talleresUi.membershipOpen && String(state.talleresUi.selectedTallerId || '').trim() === taller.taller_id;
      const selectedIds = new Set((state.talleresUi.membershipSelectedAlumnoIds || []).map((item) => String(item || '').trim()).filter(Boolean));
      const visibleCandidates = membershipOpen ? getVisibleTallerCandidateAlumnos() : [];
      host.hidden = false;
      host.innerHTML = [
        '<div class="admin-facilitadores-summary">',
          '<div class="admin-facilitadores-identity">',
            '<div>',
              '<strong>' + escapeHtml(taller.nombre || taller.taller_id) + '</strong>',
              '<div class="mini">' + escapeHtml(taller.taller_id) + '</div>',
            '</div>',
            '<span class="admin-alumnos-badge ' + getTallerStatusBadgeClass(taller.estatus) + '">' + escapeHtml(getTallerStatusLabel(taller.estatus)) + '</span>',
          '</div>',
          '<div class="admin-facilitadores-inline-actions">',
            (canManage ? '<button class="btn-ghost" type="button" onclick="openTallerEditor(\'edit\', \'' + escapeJsAttrValue(taller.taller_id) + '\')">Editar ficha</button>' : ''),
            (canManage && taller.estatus === 'activo' ? '<button class="btn-ghost" type="button" onclick="toggleTallerStatus(this, \'' + escapeJsAttrValue(taller.taller_id) + '\', \'inactivo\')">Desactivar</button>' : ''),
            (canManage && taller.estatus === 'inactivo' ? '<button class="btn-primary" type="button" onclick="toggleTallerStatus(this, \'' + escapeJsAttrValue(taller.taller_id) + '\', \'activo\')">Activar</button>' : ''),
            (canManage && taller.estatus === 'archivado' ? '<button class="btn-primary" type="button" onclick="reactivateTaller(this, \'' + escapeJsAttrValue(taller.taller_id) + '\')">Reactivar</button>' : ''),
            (canManage && taller.estatus !== 'archivado' ? '<button class="btn-accent" type="button" onclick="archiveTaller(this, \'' + escapeJsAttrValue(taller.taller_id) + '\')">Archivar</button>' : ''),
          '</div>',
          '<div class="admin-facilitadores-meta-grid">',
            '<div class="admin-alumnos-readonly"><span>Materia base</span><strong>' + escapeHtml((materia && materia.nombre) || 'Sin materia base') + '</strong></div>',
            '<div class="admin-alumnos-readonly"><span>Responsable</span><strong>' + escapeHtml((facilitador && (facilitador.nombre_mostrado || facilitador.nombre_completo)) || 'Sin responsable') + '</strong></div>',
            '<div class="admin-alumnos-readonly"><span>&Uacute;ltima actualizaci&oacute;n</span><strong>' + escapeHtml(taller.fecha_actualizacion ? formatFechaHumana(taller.fecha_actualizacion) : 'Sin dato') + '</strong></div>',
            '<div class="admin-alumnos-readonly"><span>Alumnos inscritos</span><strong>' + escapeHtml(String(activeMembers.length)) + '</strong></div>',
            '<div class="admin-alumnos-readonly"><span>Grupos mezclados</span><strong>' + escapeHtml(representedGroups.length ? String(representedGroups.length) : '0') + '</strong></div>',
            '<div class="admin-alumnos-readonly"><span>Gesti&oacute;n</span><strong>Editar alumnos</strong></div>',
          '</div>',
          '<div class="admin-taller-membership">',
            '<div class="admin-taller-membership-head">',
              '<div class="admin-taller-membership-copy">',
                '<h4>Alumnos del taller</h4>',
                '<div class="subtle">Marca o desmarca alumnos activos sin moverlos de su grupo escolar.</div>',
              '</div>',
              '<div class="admin-taller-membership-actions">',
                (canManage && taller.estatus !== 'archivado' && !membershipOpen ? '<button class="btn-primary" type="button" onclick="openTallerMembershipEditor(\'' + escapeJsAttrValue(taller.taller_id) + '\')">Editar alumnos</button>' : ''),
                (canManage && membershipOpen ? '<button class="btn-ghost" type="button" onclick="cancelTallerMembershipEditor()">Cancelar</button>' : ''),
              '</div>',
            '</div>',
            '<div class="admin-taller-membership-summary">',
              (activeMembers.length
                ? '<div class="admin-taller-member-cloud">' + activeMembers.map((row) => {
                    const alumno = row.alumno || {};
                    return '<span class="admin-taller-member-chip"><span>' + escapeHtml(getAlumnoNameLabel(Object.assign({}, alumno, { alumno_id: row.alumno_id || alumno.alumno_id }))) + '</span><span class="mini">' + escapeHtml(getGrupoNombre(alumno.grupo_id)) + '</span></span>';
                  }).join('') + '</div>'
                : '<div class="admin-alumnos-empty" style="min-height:132px;"><div><strong>Sin alumnos inscritos.</strong><div class="subtle">Usa el acceso r&aacute;pido para armar la mezcla del taller con alumnos de distintos grupos.</div></div></div>'),
            '</div>',
            (membershipOpen
              ? '<div class="admin-taller-membership-head">' +
                  '<div class="admin-taller-membership-tools">' +
                    '<label class="field" for="adminTallerMembershipSearch"><span>Buscar alumno</span><input id="adminTallerMembershipSearch" type="search" placeholder="Nombre, matr&iacute;cula o grupo"></label>' +
                    '<label class="field" for="adminTallerMembershipGroup"><span>Grupo</span><select id="adminTallerMembershipGroup"></select></label>' +
                  '</div>' +
                  '<div class="admin-taller-membership-actions">' +
                    '<button class="btn-ghost" type="button" onclick="toggleAllVisibleTallerAlumnos(true)">Seleccionar visibles</button>' +
                    '<button class="btn-ghost" type="button" onclick="toggleAllVisibleTallerAlumnos(false)">Limpiar visibles</button>' +
                    '<button id="adminTallerMembershipSaveBtn" class="btn-primary" type="button" onclick="saveTallerMemberships(this)">Guardar cambios</button>' +
                  '</div>' +
                '</div>' +
                '<div id="adminTallerMembershipCandidateList">' + renderTallerMembershipSelectionMarkup(visibleCandidates, selectedIds) + '</div>'
              : ''),
          '</div>',
        '</div>'
      ].join('');
      if (membershipOpen) {
        fillSelect($('adminTallerMembershipGroup'), state.catalogos.grupos || [], (row) => row.grupo_id, (row) => getGrupoDisplayName(row), 'Todos los grupos');
        if ($('adminTallerMembershipGroup')) $('adminTallerMembershipGroup').value = state.talleresUi.membershipGroup || '';
        if ($('adminTallerMembershipSearch')) $('adminTallerMembershipSearch').value = state.talleresUi.membershipSearch || '';
        if ($('adminTallerMembershipSearch')) $('adminTallerMembershipSearch').addEventListener('input', (event) => {
          state.talleresUi.membershipSearch = event.currentTarget.value;
          refreshTallerMembershipCandidateList();
        });
        if ($('adminTallerMembershipGroup')) $('adminTallerMembershipGroup').addEventListener('change', (event) => {
          state.talleresUi.membershipGroup = event.currentTarget.value;
          refreshTallerMembershipCandidateList();
        });
      }
    }

    function renderTallerEditorPanel() {
      const panel = $('adminTallerEditorPanel');
      if (!panel) return;
      panel.hidden = !state.talleresUi.editorOpen;
      if (panel.hidden) return;
      const mode = state.talleresUi.editorMode || 'new';
      const editor = state.talleresUi.editor || createEmptyTallerEditorState();
      if ($('adminTallerEditorTitle')) $('adminTallerEditorTitle').textContent = mode === 'edit' ? 'Editar taller' : 'Nuevo taller';
      if ($('adminTallerIdInput')) {
        $('adminTallerIdInput').value = editor.taller_id || '';
        $('adminTallerIdInput').disabled = mode === 'edit';
      }
      if ($('adminTallerNombreInput')) $('adminTallerNombreInput').value = editor.nombre || '';
      fillSelect($('adminTallerMateriaInput'), getTallerMateriaOptions(), (item) => item.materia_id, (item) => item.nombre || item.materia_id, 'Sin materia base');
      fillSelect($('adminTallerFacilitadorInput'), getTallerFacilitadorOptions(), (item) => item.facilitador_id, (item) => item.nombre_mostrado || item.nombre_completo || item.facilitador_id, 'Sin responsable');
      if ($('adminTallerMateriaInput')) $('adminTallerMateriaInput').value = editor.materia_id || '';
      if ($('adminTallerFacilitadorInput')) $('adminTallerFacilitadorInput').value = editor.facilitador_id || '';
      if ($('adminTallerStatusInput')) $('adminTallerStatusInput').value = editor.estatus || 'activo';
    }

    function openTallerEditor(mode, tallerId) {
      const nextMode = mode === 'edit' ? 'edit' : 'new';
      const taller = nextMode === 'edit'
        ? getTallerById(String(tallerId || '').trim())
        : null;
      closeTallerMembershipEditor();
      state.talleresUi.editorMode = nextMode;
      state.talleresUi.editorOpen = true;
      state.talleresUi.selectedTallerId = taller ? taller.taller_id : state.talleresUi.selectedTallerId;
      state.talleresUi.editor = taller ? {
        taller_id: taller.taller_id,
        nombre: taller.nombre || '',
        materia_id: taller.materia_id || '',
        facilitador_id: taller.facilitador_id || '',
        estatus: taller.estatus || 'activo'
      } : createEmptyTallerEditorState();
      renderAdminTalleresModule();
      focusAdminFacilitadorPanel('adminTallerEditorPanel', nextMode === 'edit' ? 'adminTallerNombreInput' : 'adminTallerIdInput');
    }

    function selectTaller(tallerId) {
      const nextId = String(tallerId || '').trim();
      if (String(state.talleresUi.selectedTallerId || '').trim() !== nextId) {
        closeTallerMembershipEditor();
      }
      state.talleresUi.selectedTallerId = nextId;
      renderAdminTalleresModule();
      if ((state.catalogos.alumno_talleres || []).some((row) => String(row.taller_id || '').trim() === nextId && row.activa !== false) && getMissingCatalogBlocks(['alumnos', 'grupos']).length) {
        ensureTallerMembershipCatalogosAvailable({ render: true }).catch(() => {});
      }
      focusAdminFacilitadorPanel('adminTallerDetailPanel');
    }

    function keepTallerSelectedAfterStatusChange(tallerId) {
      const normalizedId = String(tallerId || '').trim();
      if (!normalizedId) return;
      state.talleresUi.selectedTallerId = normalizedId;
      if (!getVisibleTalleres().some((item) => item.taller_id === normalizedId)) {
        state.talleresUi.filter = 'todos';
      }
    }

    function cancelTallerMembershipEditor() {
      closeTallerMembershipEditor();
      renderAdminTalleresModule();
    }

    async function saveTallerMemberships(button) {
      const tallerId = String(state.talleresUi.selectedTallerId || '').trim();
      if (!tallerId) throw new Error('Selecciona un taller.');
      const alumnosIds = (state.talleresUi.membershipSelectedAlumnoIds || []).map((item) => String(item || '').trim()).filter(Boolean);
      await handleAction('syncTallerAlumnos', async () => {
        const data = await api('syncTallerAlumnos', {
          taller_id: tallerId,
          alumnos_ids: alumnosIds,
          request_id: uid('TALREL')
        });
        replaceTallerAlumnoRelations(tallerId, data.relaciones || []);
        closeTallerMembershipEditor();
        renderAdminModuleSurface('talleres');
        setBanner('Alumnos del taller actualizados.', 'success');
      }, {
        button,
        key: buildActionKey('syncTallerAlumnos', [tallerId, alumnosIds.join('|')]),
        busyText: 'Guardando...'
      });
    }

    async function saveTallerEditor(button) {
      const mode = state.talleresUi.editorMode || 'new';
      const payload = {
        taller_id: $('adminTallerIdInput') ? $('adminTallerIdInput').value.trim() : '',
        nombre: $('adminTallerNombreInput') ? $('adminTallerNombreInput').value.trim() : '',
        materia_id: $('adminTallerMateriaInput') ? $('adminTallerMateriaInput').value : '',
        facilitador_id: $('adminTallerFacilitadorInput') ? $('adminTallerFacilitadorInput').value : '',
        estatus: $('adminTallerStatusInput') ? $('adminTallerStatusInput').value : 'activo',
        request_id: uid('TAL')
      };
      await handleAction('guardarTaller', async () => {
        if (!canManageTalleresCatalog()) throw new Error('No tienes permiso para editar talleres.');
        if (!payload.taller_id) throw new Error('Captura el taller ID.');
        if (!payload.nombre) throw new Error('Captura el nombre del taller.');
        const data = await api('guardarTaller', payload);
        if (data && data.taller) applySavedTallerCatalogRow(data.taller);
        closeTallerEditor();
        state.talleresUi.selectedTallerId = data.taller_id || payload.taller_id;
        renderAdminModuleSurface('talleres');
        setBanner(mode === 'new' ? 'Taller creado.' : 'Taller actualizado.', 'success');
      }, {
        button,
        key: buildActionKey('guardarTaller', [payload.taller_id, mode]),
        busyText: mode === 'new' ? 'Creando...' : 'Guardando...'
      });
    }

    async function toggleTallerStatus(button, tallerId, nextStatus) {
      const row = getTallerById(tallerId);
      if (!row) throw new Error('Taller no encontrado.');
      await handleAction('toggleTallerStatus', async () => {
        const data = await api('guardarTaller', {
          taller_id: row.taller_id,
          estatus: nextStatus,
          request_id: uid('TALTOG')
        });
        if (data && data.taller) applySavedTallerCatalogRow(data.taller);
        keepTallerSelectedAfterStatusChange(row.taller_id);
        renderAdminModuleSurface('talleres');
        setBanner(nextStatus === 'activo' ? 'Taller activado.' : 'Taller desactivado.', 'success');
      }, {
        button,
        key: buildActionKey('toggleTallerStatus', [tallerId, nextStatus]),
        busyText: nextStatus === 'activo' ? 'Activando...' : 'Desactivando...'
      });
    }

    async function archiveTaller(button, tallerId) {
      if (!window.confirm('Esto archivar\u00e1 el taller del cat\u00e1logo base.')) return;
      await handleAction('archivarTaller', async () => {
        await api('archivarTaller', {
          taller_id: tallerId,
          request_id: uid('TALARC')
        });
        upsertCatalogEntityRow('talleres_admin', 'taller_id', Object.assign({}, getTallerById(tallerId) || { taller_id: tallerId }, { estatus: 'archivado', activo: false }));
        renderAdminModuleSurface('talleres');
        setBanner('Taller archivado.', 'success');
      }, {
        button,
        key: buildActionKey('archivarTaller', [tallerId]),
        busyText: 'Archivando...'
      });
    }

    async function reactivateTaller(button, tallerId) {
      const row = getTallerById(tallerId);
      if (!row) throw new Error('Taller no encontrado.');
      await handleAction('reactivateTaller', async () => {
        const data = await api('guardarTaller', {
          taller_id: row.taller_id,
          estatus: 'activo',
          request_id: uid('TALREA')
        });
        if (data && data.taller) applySavedTallerCatalogRow(data.taller);
        renderAdminModuleSurface('talleres');
        setBanner('Taller reactivado.', 'success');
      }, {
        button,
        key: buildActionKey('reactivateTaller', [tallerId]),
        busyText: 'Reactivando...'
      });
    }

    function bindAdminTalleresEvents() {
      if ($('adminTalleresSearch')) $('adminTalleresSearch').addEventListener('input', (event) => {
        state.talleresUi.search = event.currentTarget.value;
        scheduleUiDebounce('admin-talleres-search', () => renderAdminTalleresModule());
      });
      if ($('adminTalleresFilterAllBtn')) $('adminTalleresFilterAllBtn').addEventListener('click', () => {
        state.talleresUi.filter = 'todos';
        renderAdminTalleresModule();
      });
      if ($('adminTalleresFilterActiveBtn')) $('adminTalleresFilterActiveBtn').addEventListener('click', () => {
        state.talleresUi.filter = 'activos';
        renderAdminTalleresModule();
      });
      if ($('adminTalleresFilterInactiveBtn')) $('adminTalleresFilterInactiveBtn').addEventListener('click', () => {
        state.talleresUi.filter = 'inactivos';
        renderAdminTalleresModule();
      });
      if ($('adminTalleresFilterArchivedBtn')) $('adminTalleresFilterArchivedBtn').addEventListener('click', () => {
        state.talleresUi.filter = 'archivados';
        renderAdminTalleresModule();
      });
      if ($('adminTallerNewBtn')) $('adminTallerNewBtn').addEventListener('click', () => openTallerEditor('new'));
      if ($('adminTallerCancelBtn')) $('adminTallerCancelBtn').addEventListener('click', () => {
        closeTallerEditor();
        renderAdminTalleresModule();
      });
      if ($('adminTallerSaveBtn')) $('adminTallerSaveBtn').addEventListener('click', (event) => saveTallerEditor(event.currentTarget));
    }

    function getAdminMateriasCatalog() {
      const revision = getCatalogosRevision();
      if (adminCatalogMemo.materias.revision === revision) {
        return adminCatalogMemo.materias.result;
      }
      const rows = Array.isArray(state.catalogos.materias_admin) && state.catalogos.materias_admin.length
        ? state.catalogos.materias_admin
        : (state.catalogos.materias || []);
      const result = rows.map((row) => {
        const archived = String(row.archivado_at || '').trim();
        const rawStatus = String(row.estatus || '').trim().toLowerCase();
        const status = archived
          ? 'archivada'
          : (rawStatus === 'inactiva'
            ? 'inactiva'
            : ((row.activo === false || row.activo === 'no' || row.activo === 'false') ? 'inactiva' : 'activa'));
        return {
          materia_id: String(row.materia_id || '').trim(),
          nombre: String(row.nombre || '').trim(),
          tipo: String(row.tipo || '').trim(),
          activo: status === 'activa',
          admite_submaterias: isTruthyValue(row.admite_submaterias),
          estatus: status,
          orden_visual: Number(row.orden_visual || 0),
          fecha_actualizacion: String(row.fecha_actualizacion || '').trim(),
          archivado_at: archived,
          archivado_por: String(row.archivado_por || '').trim()
        };
      }).sort((a, b) => {
        const orderDiff = Number(a.orden_visual || 0) - Number(b.orden_visual || 0);
        if (orderDiff) return orderDiff;
        return String(a.nombre || a.materia_id).localeCompare(String(b.nombre || b.materia_id), 'es');
      });
      adminCatalogMemo.materias = { revision, result };
      return result;
    }

    function applySavedMateriaCatalogRow(row) {
      const materiaId = String(row && row.materia_id || '').trim();
      if (!materiaId) return null;
      const existingAdmin = (state.catalogos.materias_admin || []).find((item) => String(item && item.materia_id || '').trim() === materiaId) || {};
      const existingPublic = (state.catalogos.materias || []).find((item) => String(item && item.materia_id || '').trim() === materiaId) || {};
      const savedRow = Object.assign({}, existingPublic, existingAdmin, row, { materia_id: materiaId });
      upsertCatalogEntityRow('materias_admin', 'materia_id', savedRow);
      upsertCatalogEntityRow('materias', 'materia_id', savedRow);
      return getAdminMateriasCatalog().find((item) => item.materia_id === materiaId) || null;
    }

    function applyPatchedMateriaCatalogRow(materiaId, patch = {}) {
      const current = getMateriaBaseRows().find((item) => item.materia_id === String(materiaId || '').trim());
      if (!current) return null;
      return applySavedMateriaCatalogRow(Object.assign({}, current, patch));
    }

    function applySavedSubmateriaCatalogRow(row) {
      if (!row || !row.submateria_id) return null;
      upsertCatalogEntityRow('submaterias_admin', 'submateria_id', row);
      upsertCatalogEntityRow('submaterias', 'submateria_id', row);
      return getAdminSubmateriasCatalog().find((item) => item.submateria_id === row.submateria_id) || null;
    }

    function applyPatchedSubmateriaCatalogRow(submateriaId, patch = {}) {
      const current = getAdminSubmateriasCatalog().find((item) => item.submateria_id === String(submateriaId || '').trim());
      if (!current) return null;
      return applySavedSubmateriaCatalogRow(Object.assign({}, current, patch));
    }

    function getAdminSubmateriasCatalog() {
      const revision = getCatalogosRevision();
      if (adminCatalogMemo.submaterias.revision === revision) {
        return adminCatalogMemo.submaterias.result;
      }
      const rows = Array.isArray(state.catalogos.submaterias_admin) && state.catalogos.submaterias_admin.length
        ? state.catalogos.submaterias_admin
        : (state.catalogos.submaterias || []);
      const result = rows.map((row) => {
        const archived = String(row.archivado_at || '').trim();
        const rawStatus = String(row.estatus || '').trim().toLowerCase();
        const status = archived ? 'archivada' : (rawStatus === 'inactiva' ? 'inactiva' : 'activa');
        return {
          submateria_id: String(row.submateria_id || '').trim(),
          materia_id: String(row.materia_id || '').trim(),
          nombre: String(row.nombre || '').trim(),
          estatus: status,
          orden: Number(row.orden || 0),
          fecha_actualizacion: String(row.fecha_actualizacion || '').trim(),
          archivado_at: archived,
          archivado_por: String(row.archivado_por || '').trim()
        };
      }).sort((a, b) => {
        if (String(a.materia_id || '') !== String(b.materia_id || '')) {
          return String(a.materia_id || '').localeCompare(String(b.materia_id || ''), 'es');
        }
        const orderDiff = Number(a.orden || 0) - Number(b.orden || 0);
        if (orderDiff) return orderDiff;
        return String(a.nombre || a.submateria_id).localeCompare(String(b.nombre || b.submateria_id), 'es');
      });
      adminCatalogMemo.submaterias = { revision, result };
      return result;
    }

    function getMateriaBaseRows() {
      return getAdminMateriasCatalog();
    }

    function getSubmateriasForMateria(materiaId) {
      const id = String(materiaId || '').trim();
      return getAdminSubmateriasCatalog().filter((row) => row.materia_id === id);
    }

    function getSelectedMateria() {
      const selectedId = String(state.materiasUi.selectedMateriaId || '').trim();
      return getMateriaBaseRows().find((row) => row.materia_id === selectedId) || null;
    }

    function getMateriaSearchText(row) {
      const variants = getSubmateriasForMateria(row.materia_id).map((item) => item.nombre + ' ' + item.submateria_id).join(' ');
      return [
        row.materia_id,
        row.nombre,
        row.tipo,
        variants
      ].join(' ').toLowerCase();
    }

    function materiaHasVariants(row) {
      return !!(row && (row.admite_submaterias || getSubmateriasForMateria(row.materia_id).length));
    }

    function getFilteredMaterias() {
      const filter = String(state.materiasUi.filter || 'activas').trim();
      const query = String(state.materiasUi.search || '').trim().toLowerCase();
      return getMateriaBaseRows().filter((row) => {
        if (filter === 'activas' && row.estatus !== 'activa') return false;
        if (filter === 'archivadas' && row.estatus !== 'archivada') return false;
        if (filter === 'con_submaterias' && !materiaHasVariants(row)) return false;
        if (!query) return true;
        return getMateriaSearchText(row).includes(query);
      });
    }

    function getVisibleMaterias() {
      return getFilteredMaterias();
    }

    function getMateriaStatusLabel(status) {
      if (status === 'archivada') return 'Archivada';
      if (status === 'inactiva') return 'Inactiva';
      return 'Activa';
    }

    function getMateriaStatusBadgeClass(status) {
      if (status === 'archivada') return 'is-archived';
      if (status === 'inactiva') return 'is-inactive';
      return 'is-active';
    }

    function getMateriaStructureLabel(row) {
      return materiaHasVariants(row) ? 'Con variantes' : 'Simple';
    }

    function getMateriasKpis() {
      const rows = getMateriaBaseRows();
      return {
        total: rows.length,
        activas: rows.filter((row) => row.estatus === 'activa').length,
        conSubmaterias: rows.filter((row) => materiaHasVariants(row)).length,
        archivadas: rows.filter((row) => row.estatus === 'archivada').length
      };
    }

    function closeMateriaEditor() {
      state.materiasUi.editorOpen = false;
      state.materiasUi.editorMode = 'new';
      state.materiasUi.editor = createEmptyMateriaEditorState();
    }

    function closeSubmateriaEditor() {
      state.materiasUi.subEditorOpen = false;
      state.materiasUi.subEditorMode = 'new';
      state.materiasUi.subEditor = createEmptySubmateriaEditorState();
    }

    function syncAdminMateriasModule() {
      const visible = getVisibleMaterias();
      const selected = String(state.materiasUi.selectedMateriaId || '').trim();
      if (selected && visible.some((row) => row.materia_id === selected)) return;
      state.materiasUi.selectedMateriaId = visible.length ? visible[0].materia_id : '';
      if (!visible.length) {
        closeMateriaEditor();
        closeSubmateriaEditor();
      }
    }

    function getAdminMateriasModuleTemplate() {
      return [
        '<article class="admin-toolbar admin-alumnos-module admin-materias-module">',
          '<div class="admin-toolbar-head admin-alumnos-head">',
            '<div class="admin-alumnos-head-copy">',
              '<h3>Materias</h3>',
              '<p class="subtle">Administra el cat&aacute;logo base y sus variantes operativas.</p>',
            '</div>',
            '<div class="admin-alumnos-head-actions">',
              '<label class="admin-alumnos-search" for="adminMateriasSearch">',
                '<span>Buscar</span>',
                '<input id="adminMateriasSearch" type="search" placeholder="Buscar materia o variante">',
              '</label>',
              '<button id="adminMateriaNewBtn" class="btn-primary" type="button">Nueva materia</button>',
            '</div>',
          '</div>',
          '<div class="admin-materias-kpis">',
            '<div class="admin-materias-kpi"><strong id="adminMateriasKpiTotal">0</strong><span>Total materias</span></div>',
            '<div class="admin-materias-kpi"><strong id="adminMateriasKpiActive">0</strong><span>Activas</span></div>',
            '<div class="admin-materias-kpi"><strong id="adminMateriasKpiVariants">0</strong><span>Con variantes</span></div>',
            '<div class="admin-materias-kpi"><strong id="adminMateriasKpiArchived">0</strong><span>Archivadas</span></div>',
          '</div>',
          '<div class="admin-alumnos-filterbar">',
            '<div class="admin-alumnos-filterchips">',
              '<button id="adminMateriasFilterAllBtn" class="btn-ghost" type="button">Todas</button>',
              '<button id="adminMateriasFilterActiveBtn" class="btn-ghost" type="button">Activas</button>',
              '<button id="adminMateriasFilterArchivedBtn" class="btn-ghost" type="button">Archivadas</button>',
              '<button id="adminMateriasFilterVariantsBtn" class="btn-ghost" type="button">Con submaterias</button>',
            '</div>',
          '</div>',
          '<div class="admin-alumnos-layout">',
            '<section class="admin-alumnos-main">',
              '<div class="admin-alumnos-section-head">',
                '<div>',
                  '<h4 id="adminMateriasListTitle">Materias activas</h4>',
                  '<div id="adminMateriasListMeta" class="subtle">Cat&aacute;logo base, estructura y orden visual.</div>',
                '</div>',
              '</div>',
              '<div id="adminMateriasList" class="admin-alumnos-list"></div>',
            '</section>',
            '<aside class="admin-alumnos-side">',
              '<section id="adminMateriaDetailPanel" class="admin-alumnos-panel"></section>',
              '<section id="adminMateriaEditorPanel" class="admin-alumnos-panel" hidden>',
                '<div class="admin-alumnos-panel-head">',
                  '<div>',
                    '<h4 id="adminMateriaEditorTitle">Nueva materia</h4>',
                    '<div class="subtle">Define cat&aacute;logo base, estructura y estatus operativo.</div>',
                  '</div>',
                '</div>',
                '<div class="admin-alumnos-editor-grid">',
                  '<label class="field">',
                    '<span>Materia ID</span>',
                    '<input id="adminMateriaIdInput" type="text" maxlength="50" placeholder="Ej. MAT-010">',
                  '</label>',
                  '<label class="field">',
                    '<span>Estatus</span>',
                    '<select id="adminMateriaStatusInput">',
                      '<option value="activa">Activa</option>',
                      '<option value="inactiva">Inactiva</option>',
                      '<option value="archivada">Archivada</option>',
                    '</select>',
                  '</label>',
                  '<label class="field admin-alumnos-field-full">',
                    '<span>Nombre</span>',
                    '<input id="adminMateriaNombreInput" type="text" maxlength="100" placeholder="Nombre visible de la materia">',
                  '</label>',
                  '<label class="field admin-alumnos-field-full">',
                    '<span>Estructura</span>',
                    '<select id="adminMateriaVariantsInput">',
                      '<option value="no">Simple</option>',
                      '<option value="si">Con submaterias</option>',
                    '</select>',
                  '</label>',
                '</div>',
                '<div class="actions compact admin-alumnos-panel-actions">',
                  '<button id="adminMateriaCancelBtn" class="btn-ghost" type="button">Cancelar</button>',
                  '<button id="adminMateriaSaveBtn" class="btn-primary" type="button">Guardar</button>',
                '</div>',
              '</section>',
            '</aside>',
          '</div>',
        '</article>'
      ].join('');
    }

    function renderAdminMateriasModule() {
      const panel = $('admin-panel-materias');
      if (!panel || !canUseAdminShell()) return;
      if (panel.dataset.ready !== '1') {
        panel.innerHTML = getAdminMateriasModuleTemplate();
        panel.dataset.ready = '1';
        bindAdminMateriasEvents();
      }
      syncAdminMateriasModule();
      const kpis = getMateriasKpis();
      if ($('adminMateriasSearch')) $('adminMateriasSearch').value = state.materiasUi.search || '';
      if ($('adminMateriasKpiTotal')) $('adminMateriasKpiTotal').textContent = String(kpis.total);
      if ($('adminMateriasKpiActive')) $('adminMateriasKpiActive').textContent = String(kpis.activas);
      if ($('adminMateriasKpiVariants')) $('adminMateriasKpiVariants').textContent = String(kpis.conSubmaterias);
      if ($('adminMateriasKpiArchived')) $('adminMateriasKpiArchived').textContent = String(kpis.archivadas);
      if ($('adminMateriasFilterAllBtn')) $('adminMateriasFilterAllBtn').classList.toggle('is-active', state.materiasUi.filter === 'todas');
      if ($('adminMateriasFilterActiveBtn')) $('adminMateriasFilterActiveBtn').classList.toggle('is-active', state.materiasUi.filter === 'activas');
      if ($('adminMateriasFilterArchivedBtn')) $('adminMateriasFilterArchivedBtn').classList.toggle('is-active', state.materiasUi.filter === 'archivadas');
      if ($('adminMateriasFilterVariantsBtn')) $('adminMateriasFilterVariantsBtn').classList.toggle('is-active', state.materiasUi.filter === 'con_submaterias');
      renderAdminMateriasList();
      renderAdminMateriaDetail();
      renderMateriaEditor();
    }

    function renderAdminMateriasList() {
      const host = $('adminMateriasList');
      if (!host) return;
      const rows = getVisibleMaterias();
      const filter = String(state.materiasUi.filter || 'activas').trim();
      if ($('adminMateriasListTitle')) {
        $('adminMateriasListTitle').textContent = filter === 'todas'
          ? 'Todas las materias'
          : (filter === 'archivadas'
            ? 'Materias archivadas'
            : (filter === 'con_submaterias' ? 'Materias con submaterias' : 'Materias activas'));
      }
      if ($('adminMateriasListMeta')) $('adminMateriasListMeta').textContent = rows.length + ' materia(s) visibles en esta vista.';
      if (!rows.length) {
        host.innerHTML = '<div class="admin-alumnos-empty"><div><strong>No hay materias para mostrar.</strong><div class="subtle">Ajusta el filtro o crea una materia base para empezar.</div></div></div>';
        return;
      }
      host.innerHTML = [
        '<div class="admin-alumnos-table">',
          '<div class="admin-materias-list-header">',
            '<div>Orden</div>',
            '<div>Materia</div>',
            '<div>Tipo</div>',
            '<div>Estado</div>',
            '<div>Submaterias</div>',
            '<div>Acciones</div>',
          '</div>',
          rows.map((row) => {
            const selected = String(state.materiasUi.selectedMateriaId || '').trim() === row.materia_id;
            const subRows = getSubmateriasForMateria(row.materia_id);
            const actions = [
              '<button class="btn-ghost" type="button" onclick="event.stopPropagation(); openMateriaEditor(\'edit\', \'' + escapeJsAttrValue(row.materia_id) + '\')">Editar</button>',
              '<button class="btn-ghost" type="button" title="Subir materia" aria-label="Subir materia" onclick="event.stopPropagation(); moveMateria(this, \'' + escapeJsAttrValue(row.materia_id) + '\', \'up\')">&uarr;</button>',
              '<button class="btn-ghost" type="button" title="Bajar materia" aria-label="Bajar materia" onclick="event.stopPropagation(); moveMateria(this, \'' + escapeJsAttrValue(row.materia_id) + '\', \'down\')">&darr;</button>',
              '<button class="btn-secondary" type="button" onclick="event.stopPropagation(); selectMateria(\'' + escapeJsAttrValue(row.materia_id) + '\')">Ver panel</button>'
            ];
            return [
              '<article class="admin-materias-row' + (selected ? ' is-selected' : '') + '" onclick="selectMateria(\'' + escapeJsAttrValue(row.materia_id) + '\')">',
                '<div class="admin-alumnos-cell"><span class="admin-materias-order">' + escapeHtml(String(row.orden_visual || 0)) + '</span></div>',
                '<div class="admin-alumnos-title"><strong>' + escapeHtml(row.nombre || row.materia_id) + '</strong><div class="mini">' + escapeHtml(row.materia_id) + '</div></div>',
                '<div class="admin-alumnos-cell"><div class="admin-materias-structure"><span class="admin-alumnos-badge">' + escapeHtml(getMateriaStructureLabel(row)) + '</span></div></div>',
                '<div class="admin-alumnos-cell"><span class="admin-alumnos-badge ' + getMateriaStatusBadgeClass(row.estatus) + '">' + escapeHtml(getMateriaStatusLabel(row.estatus)) + '</span></div>',
                '<div class="admin-alumnos-cell"><div class="mini">' + escapeHtml(String(subRows.length)) + ' variante(s)</div></div>',
                '<div class="admin-alumnos-actions">' + actions.join('') + '</div>',
              '</article>'
            ].join('');
          }).join(''),
        '</div>'
      ].join('');
    }

    function renderAdminMateriaDetail() {
      const host = $('adminMateriaDetailPanel');
      if (!host) return;
      const materia = getSelectedMateria();
      if (!materia) {
        host.innerHTML = '<div class="admin-alumnos-empty"><div><strong>Selecciona una materia</strong><div class="subtle">Aqu&iacute; aparecer&aacute; su estructura, variantes y acciones operativas.</div></div></div>';
        return;
      }
      const subRows = getSubmateriasForMateria(materia.materia_id);
      const canManage = canUseAdminShell();
      host.hidden = false;
      host.innerHTML = [
        '<div class="admin-materias-detail">',
          '<div class="admin-materias-identity">',
            '<div>',
              '<strong>' + escapeHtml(materia.nombre || materia.materia_id) + '</strong>',
              '<div class="mini">' + escapeHtml(materia.materia_id) + ' &middot; ' + escapeHtml(getMateriaStructureLabel(materia)) + '</div>',
            '</div>',
            '<div class="admin-materias-structure">',
              '<span class="admin-alumnos-badge">' + escapeHtml(getMateriaStructureLabel(materia)) + '</span>',
              '<span class="admin-alumnos-badge ' + getMateriaStatusBadgeClass(materia.estatus) + '">' + escapeHtml(getMateriaStatusLabel(materia.estatus)) + '</span>',
            '</div>',
          '</div>',
          '<div class="admin-materias-inline-actions">',
            (canManage ? '<button class="btn-ghost" type="button" onclick="openMateriaEditor(\'edit\', \'' + escapeJsAttrValue(materia.materia_id) + '\')">Editar materia</button>' : ''),
            (canManage && materia.estatus === 'activa' ? '<button class="btn-secondary" type="button" onclick="toggleMateriaStatus(this, \'' + escapeJsAttrValue(materia.materia_id) + '\')">Desactivar</button>' : ''),
            (canManage && materia.estatus === 'inactiva' ? '<button class="btn-secondary" type="button" onclick="toggleMateriaStatus(this, \'' + escapeJsAttrValue(materia.materia_id) + '\')">Activar</button>' : ''),
            (canManage && materia.estatus === 'archivada' ? '<button class="btn-secondary" type="button" onclick="reactivateMateria(this, \'' + escapeJsAttrValue(materia.materia_id) + '\')">Reactivar</button>' : ''),
            (canManage && materia.estatus !== 'archivada' ? '<button class="btn-accent" type="button" onclick="archiveMateria(this, \'' + escapeJsAttrValue(materia.materia_id) + '\')">Archivar</button>' : ''),
            (canManage && materiaHasVariants(materia) && materia.estatus !== 'archivada' ? '<button class="btn-primary" type="button" onclick="openSubmateriaEditor(\'new\', \'' + escapeJsAttrValue(materia.materia_id) + '\')">Agregar submateria</button>' : ''),
          '</div>',
          '<div class="admin-materias-meta-grid">',
            '<div class="admin-alumnos-readonly"><span>Materia ID</span><strong>' + escapeHtml(materia.materia_id) + '</strong></div>',
            '<div class="admin-alumnos-readonly"><span>Orden visual</span><strong>' + escapeHtml(String(materia.orden_visual || 0)) + '</strong></div>',
            '<div class="admin-alumnos-readonly"><span>Estructura</span><strong>' + escapeHtml(getMateriaStructureLabel(materia)) + '</strong></div>',
            '<div class="admin-alumnos-readonly"><span>Variantes registradas</span><strong>' + escapeHtml(String(subRows.length)) + '</strong></div>',
          '</div>',
          '<div class="admin-alumnos-section-head"><div><h4>Variantes</h4><div class="subtle">' + escapeHtml(materiaHasVariants(materia) ? 'Submaterias de operaci\u00f3n para esta materia base.' : 'Materia simple sin variantes registradas.') + '</div></div></div>',
          (materiaHasVariants(materia) ? renderMateriaVariantsList(materia) : '<div class="admin-alumnos-empty" style="min-height:136px;"><div><strong>Materia simple.</strong><div class="subtle">Esta materia no usa submaterias operativas en este momento.</div></div></div>'),
          (state.materiasUi.subEditorOpen && String(state.materiasUi.subEditor.materia_id || '').trim() === materia.materia_id ? renderSubmateriaEditor() : ''),
        '</div>'
      ].join('');
    }

    function renderMateriaVariantsList(materia) {
      const subRows = getSubmateriasForMateria(materia.materia_id);
      if (!subRows.length) {
        return '<div class="admin-alumnos-empty" style="min-height:140px;"><div><strong>Sin variantes registradas.</strong><div class="subtle">Agrega submaterias para especializar la operaci&oacute;n sin duplicar la materia base.</div></div></div>';
      }
      return [
        '<div class="admin-materias-variants">',
          subRows.map((row) => {
            const actions = [
              '<button class="btn-ghost" type="button" onclick="openSubmateriaEditor(\'edit\', \'' + escapeJsAttrValue(materia.materia_id) + '\', \'' + escapeJsAttrValue(row.submateria_id) + '\')">Editar</button>',
              '<button class="btn-ghost" type="button" title="Subir submateria" aria-label="Subir submateria" onclick="moveSubmateria(this, \'' + escapeJsAttrValue(materia.materia_id) + '\', \'' + escapeJsAttrValue(row.submateria_id) + '\', \'up\')">&uarr;</button>',
              '<button class="btn-ghost" type="button" title="Bajar submateria" aria-label="Bajar submateria" onclick="moveSubmateria(this, \'' + escapeJsAttrValue(materia.materia_id) + '\', \'' + escapeJsAttrValue(row.submateria_id) + '\', \'down\')">&darr;</button>',
              (row.estatus === 'activa'
                ? '<button class="btn-secondary" type="button" onclick="toggleSubmateriaStatus(this, \'' + escapeJsAttrValue(materia.materia_id) + '\', \'' + escapeJsAttrValue(row.submateria_id) + '\')">Desactivar</button>'
                : (row.estatus === 'inactiva'
                  ? '<button class="btn-secondary" type="button" onclick="toggleSubmateriaStatus(this, \'' + escapeJsAttrValue(materia.materia_id) + '\', \'' + escapeJsAttrValue(row.submateria_id) + '\')">Activar</button>'
                  : '<button class="btn-secondary" type="button" onclick="reactivateSubmateria(this, \'' + escapeJsAttrValue(materia.materia_id) + '\', \'' + escapeJsAttrValue(row.submateria_id) + '\')">Reactivar</button>'))
            ];
            if (row.estatus !== 'archivada') {
              actions.push('<button class="btn-accent" type="button" onclick="archiveSubmateria(this, \'' + escapeJsAttrValue(materia.materia_id) + '\', \'' + escapeJsAttrValue(row.submateria_id) + '\')">Archivar</button>');
            }
            return [
              '<article class="admin-materias-variant-item">',
                '<div class="admin-materias-variant-copy">',
                  '<strong>' + escapeHtml(row.nombre || row.submateria_id) + '</strong>',
                  '<div class="mini">' + escapeHtml(row.submateria_id) + ' &middot; ' + escapeHtml(getMateriaStatusLabel(row.estatus)) + ' &middot; Orden ' + escapeHtml(String(row.orden || 0)) + '</div>',
                '</div>',
                '<div class="admin-materias-variant-actions">' + actions.join('') + '</div>',
              '</article>'
            ].join('');
          }).join(''),
        '</div>'
      ].join('');
    }

    function renderMateriaEditor() {
      const panel = $('adminMateriaEditorPanel');
      if (!panel) return;
      panel.hidden = !state.materiasUi.editorOpen;
      if (panel.hidden) return;
      const mode = state.materiasUi.editorMode || 'new';
      const editor = state.materiasUi.editor || createEmptyMateriaEditorState();
      if ($('adminMateriaEditorTitle')) $('adminMateriaEditorTitle').textContent = mode === 'edit' ? 'Editar materia' : 'Nueva materia';
      if ($('adminMateriaIdInput')) {
        $('adminMateriaIdInput').value = editor.materia_id || '';
        $('adminMateriaIdInput').disabled = mode === 'edit';
      }
      if ($('adminMateriaNombreInput')) $('adminMateriaNombreInput').value = editor.nombre || '';
      if ($('adminMateriaVariantsInput')) $('adminMateriaVariantsInput').value = editor.admite_submaterias ? 'si' : 'no';
      if ($('adminMateriaStatusInput')) $('adminMateriaStatusInput').value = editor.estatus || 'activa';
    }

    function renderSubmateriaEditor() {
      const editor = state.materiasUi.subEditor || createEmptySubmateriaEditorState();
      return [
        '<section class="admin-alumnos-panel">',
          '<div class="admin-alumnos-panel-head"><div><h4>' + escapeHtml(editor.submateria_id ? 'Editar submateria' : 'Nueva submateria') + '</h4><div class="subtle">Mant&eacute;n la materia base limpia y administra sus variantes aqu&iacute;.</div></div></div>',
          '<div class="admin-alumnos-mini-grid">',
            '<label class="field">',
              '<span>Submateria ID</span>',
              '<input id="adminSubmateriaIdInput" type="text" maxlength="50" value="' + escapeHtml(editor.submateria_id || '') + '"' + (editor.submateria_id ? ' disabled' : '') + ' placeholder="Ej. SUB-FUT">',
            '</label>',
            '<label class="field">',
              '<span>Estatus</span>',
              '<select id="adminSubmateriaStatusInput">',
                '<option value="activa"' + (editor.estatus === 'activa' ? ' selected' : '') + '>Activa</option>',
                '<option value="inactiva"' + (editor.estatus === 'inactiva' ? ' selected' : '') + '>Inactiva</option>',
                '<option value="archivada"' + (editor.estatus === 'archivada' ? ' selected' : '') + '>Archivada</option>',
              '</select>',
            '</label>',
            '<label class="field admin-alumnos-field-full">',
              '<span>Nombre</span>',
              '<input id="adminSubmateriaNombreInput" type="text" maxlength="100" value="' + escapeHtml(editor.nombre || '') + '" placeholder="Nombre visible de la variante">',
            '</label>',
          '</div>',
          '<div class="actions compact admin-alumnos-panel-actions">',
            '<button class="btn-ghost" type="button" onclick="closeSubmateriaEditor(); renderAdminMateriasModule()">Cancelar</button>',
            '<button class="btn-primary" type="button" onclick="saveSubmateriaEditor(this)">Guardar</button>',
          '</div>',
        '</section>'
      ].join('');
    }

    function openMateriaEditor(mode, materiaId) {
      const nextMode = mode === 'edit' ? 'edit' : 'new';
      const materia = nextMode === 'edit'
        ? getMateriaBaseRows().find((row) => row.materia_id === String(materiaId || '').trim())
        : null;
      state.materiasUi.editorMode = nextMode;
      state.materiasUi.editorOpen = true;
      state.materiasUi.subEditorOpen = false;
      state.materiasUi.selectedMateriaId = materia ? materia.materia_id : state.materiasUi.selectedMateriaId;
      state.materiasUi.editor = materia ? {
        materia_id: materia.materia_id,
        nombre: materia.nombre || '',
        admite_submaterias: materiaHasVariants(materia),
        estatus: materia.estatus || 'activa'
      } : createEmptyMateriaEditorState();
      renderAdminMateriasModule();
      focusAdminFacilitadorPanel(
        'adminMateriaEditorPanel',
        nextMode === 'edit' ? 'adminMateriaNombreInput' : 'adminMateriaIdInput'
      );
    }

    async function saveMateriaEditor(button) {
      const mode = state.materiasUi.editorMode || 'new';
      const payload = {
        materia_id: $('adminMateriaIdInput') ? $('adminMateriaIdInput').value.trim() : '',
        nombre: $('adminMateriaNombreInput') ? $('adminMateriaNombreInput').value.trim() : '',
        admite_submaterias: $('adminMateriaVariantsInput') ? $('adminMateriaVariantsInput').value === 'si' : false,
        estatus: $('adminMateriaStatusInput') ? $('adminMateriaStatusInput').value : 'activa',
        request_id: uid('MAT')
      };
      await handleAction('guardarMateria', async () => {
        if (!payload.materia_id) throw new Error('Captura la materia ID.');
        if (!payload.nombre) throw new Error('Captura el nombre de la materia.');
        const currentMateria = getMateriaBaseRows().find((item) => item.materia_id === payload.materia_id) || {};
        const data = await api('guardarMateria', payload);
        const backendMateria = data && data.materia ? data.materia : {};
        const savedAt = String(backendMateria.fecha_actualizacion || new Date().toISOString());
        const archivedAt = payload.estatus === 'archivada'
          ? String(backendMateria.archivado_at || currentMateria.archivado_at || savedAt)
          : '';
        const savedMateria = applySavedMateriaCatalogRow(Object.assign({}, currentMateria, backendMateria, {
          materia_id: payload.materia_id,
          nombre: payload.nombre,
          tipo: payload.admite_submaterias ? 'con_submaterias' : 'simple',
          activo: payload.estatus === 'activa',
          admite_submaterias: payload.admite_submaterias,
          estatus: payload.estatus,
          fecha_actualizacion: savedAt,
          archivado_at: archivedAt,
          archivado_por: archivedAt
            ? String(backendMateria.archivado_por || (state.session && state.session.usuario && state.session.usuario.facilitador_id) || '')
            : ''
        }));
        closeMateriaEditor();
        state.materiasUi.selectedMateriaId = (savedMateria && savedMateria.materia_id) || data.materia_id || payload.materia_id;
        renderAdminModuleSurface('materias');
        setBanner(mode === 'new' ? 'Materia creada.' : 'Materia actualizada.', 'success');
      }, {
        button,
        key: buildActionKey('guardarMateria', [payload.materia_id, mode]),
        busyText: mode === 'new' ? 'Creando...' : 'Guardando...'
      });
    }

    function openSubmateriaEditor(mode, materiaId, submateriaId) {
      const nextMode = mode === 'edit' ? 'edit' : 'new';
      const parentId = String(materiaId || state.materiasUi.selectedMateriaId || '').trim();
      const current = nextMode === 'edit'
        ? getSubmateriasForMateria(parentId).find((row) => row.submateria_id === String(submateriaId || '').trim())
        : null;
      state.materiasUi.selectedMateriaId = parentId;
      state.materiasUi.subEditorOpen = true;
      state.materiasUi.subEditorMode = nextMode;
      state.materiasUi.subEditor = current ? {
        submateria_id: current.submateria_id,
        materia_id: current.materia_id,
        nombre: current.nombre || '',
        estatus: current.estatus || 'activa'
      } : {
        submateria_id: '',
        materia_id: parentId,
        nombre: '',
        estatus: 'activa'
      };
      renderAdminMateriasModule();
      focusAdminFacilitadorPanel('adminMateriaDetailPanel', nextMode === 'edit' ? 'adminSubmateriaNombreInput' : 'adminSubmateriaIdInput');
    }

    async function saveSubmateriaEditor(button) {
      const editor = state.materiasUi.subEditor || createEmptySubmateriaEditorState();
      const payload = {
        materia_id: editor.materia_id,
        submateria_id: $('adminSubmateriaIdInput') ? $('adminSubmateriaIdInput').value.trim() : editor.submateria_id,
        nombre: $('adminSubmateriaNombreInput') ? $('adminSubmateriaNombreInput').value.trim() : editor.nombre,
        estatus: $('adminSubmateriaStatusInput') ? $('adminSubmateriaStatusInput').value : editor.estatus,
        request_id: uid('SUB')
      };
      await handleAction('guardarSubmateria', async () => {
        if (!payload.materia_id) throw new Error('Selecciona una materia base.');
        if (!payload.submateria_id) throw new Error('Captura la submateria ID.');
        if (!payload.nombre) throw new Error('Captura el nombre de la submateria.');
        await api('guardarSubmateria', payload);
        applySavedSubmateriaCatalogRow(Object.assign({}, state.materiasUi.subEditorMode === 'edit'
          ? (getAdminSubmateriasCatalog().find((item) => item.submateria_id === payload.submateria_id) || {})
          : {}, {
          materia_id: payload.materia_id,
          submateria_id: payload.submateria_id,
          nombre: payload.nombre,
          estatus: payload.estatus,
          fecha_actualizacion: new Date().toISOString(),
          archivado_at: payload.estatus === 'archivada' ? new Date().toISOString() : '',
          archivado_por: payload.estatus === 'archivada' ? String(state.session && state.session.usuario && state.session.usuario.facilitador_id || '') : ''
        }));
        closeSubmateriaEditor();
        state.materiasUi.selectedMateriaId = payload.materia_id;
        renderAdminModuleSurface('materias');
        setBanner('Submateria guardada.', 'success');
      }, {
        button,
        key: buildActionKey('guardarSubmateria', [payload.materia_id, payload.submateria_id]),
        busyText: 'Guardando...'
      });
    }

    function selectMateria(materiaId) {
      state.materiasUi.selectedMateriaId = String(materiaId || '').trim();
      renderAdminMateriasModule();
      focusAdminFacilitadorPanel('adminMateriaDetailPanel');
    }

    function keepMateriaSelectedAfterStatusChange(materiaId) {
      const normalizedId = String(materiaId || '').trim();
      if (!normalizedId) return;
      state.materiasUi.selectedMateriaId = normalizedId;
      if (!getVisibleMaterias().some((item) => item.materia_id === normalizedId)) {
        state.materiasUi.filter = 'todas';
      }
    }

    async function archiveMateria(button, materiaId) {
      if (!window.confirm('Esto archivar\u00e1 la materia base y retirar\u00e1 sus variantes operativas visibles.')) return;
      await handleAction('archivarMateria', async () => {
        await api('archivarMateria', {
          materia_id: materiaId,
          request_id: uid('MATARC')
        });
        const archivedAt = new Date().toISOString();
        applyPatchedMateriaCatalogRow(materiaId, {
          activo: false,
          estatus: 'archivada',
          archivado_at: archivedAt,
          archivado_por: String(state.session && state.session.usuario && state.session.usuario.facilitador_id || ''),
          fecha_actualizacion: archivedAt
        });
        getSubmateriasForMateria(materiaId).forEach((row) => {
          applyPatchedSubmateriaCatalogRow(row.submateria_id, {
            estatus: 'archivada',
            archivado_at: archivedAt,
            archivado_por: String(state.session && state.session.usuario && state.session.usuario.facilitador_id || ''),
            fecha_actualizacion: archivedAt
          });
        });
        renderAdminModuleSurface('materias');
        setBanner('Materia archivada.', 'success');
      }, {
        button,
        key: buildActionKey('archivarMateria', [materiaId]),
        busyText: 'Archivando...'
      });
    }

    async function toggleMateriaStatus(button, materiaId) {
      const row = getMateriaBaseRows().find((item) => item.materia_id === String(materiaId || '').trim());
      if (!row) throw new Error('Materia no encontrada.');
      if (row.estatus === 'archivada') throw new Error('Usa la acci\u00f3n de reactivar para una materia archivada.');
      const nextStatus = row.estatus === 'activa' ? 'inactiva' : 'activa';
      await handleAction('toggleMateriaStatus', async () => {
        await api('guardarMateria', {
          materia_id: row.materia_id,
          estatus: nextStatus,
          request_id: uid('MATTOG')
        });
        applyPatchedMateriaCatalogRow(row.materia_id, {
          activo: nextStatus === 'activa',
          estatus: nextStatus,
          archivado_at: '',
          archivado_por: '',
          fecha_actualizacion: new Date().toISOString()
        });
        keepMateriaSelectedAfterStatusChange(row.materia_id);
        renderAdminModuleSurface('materias');
        setBanner(nextStatus === 'activa' ? 'Materia activada.' : 'Materia desactivada.', 'success');
      }, {
        button,
        key: buildActionKey('toggleMateriaStatus', [materiaId, nextStatus]),
        busyText: nextStatus === 'activa' ? 'Activando...' : 'Desactivando...'
      });
    }

    async function reactivateMateria(button, materiaId) {
      const row = getMateriaBaseRows().find((item) => item.materia_id === String(materiaId || '').trim());
      if (!row) throw new Error('Materia no encontrada.');
      await handleAction('reactivateMateria', async () => {
        await api('guardarMateria', {
          materia_id: row.materia_id,
          estatus: 'activa',
          request_id: uid('MATREA')
        });
        applyPatchedMateriaCatalogRow(row.materia_id, {
          activo: true,
          estatus: 'activa',
          archivado_at: '',
          archivado_por: '',
          fecha_actualizacion: new Date().toISOString()
        });
        renderAdminModuleSurface('materias');
        setBanner('Materia reactivada.', 'success');
      }, {
        button,
        key: buildActionKey('reactivateMateria', [materiaId]),
        busyText: 'Reactivando...'
      });
    }

    async function moveMateria(button, materiaId, direction) {
      await handleAction('reordenarMateria', async () => {
        await api('reordenarMateria', {
          materia_id: materiaId,
          direction: direction,
          request_id: uid('MATMOV')
        });
        const visibleRows = getMateriaBaseRows().filter((item) => item.estatus !== 'archivada');
        const currentIndex = visibleRows.findIndex((item) => item.materia_id === String(materiaId || '').trim());
        const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        if (currentIndex >= 0 && targetIndex >= 0 && targetIndex < visibleRows.length) {
          const current = visibleRows[currentIndex];
          const target = visibleRows[targetIndex];
          applyPatchedMateriaCatalogRow(current.materia_id, { orden_visual: target.orden_visual });
          applyPatchedMateriaCatalogRow(target.materia_id, { orden_visual: current.orden_visual });
        }
        renderAdminModuleSurface('materias');
      }, {
        button,
        key: buildActionKey('reordenarMateria', [materiaId, direction]),
        busyText: direction === 'up' ? 'Subiendo...' : 'Bajando...'
      });
    }

    async function archiveSubmateria(button, materiaId, submateriaId) {
      if (!window.confirm('Esta variante dejar\u00e1 de estar disponible en el cat\u00e1logo operativo.')) return;
      await handleAction('archivarSubmateria', async () => {
        await api('archivarSubmateria', {
          submateria_id: submateriaId,
          request_id: uid('SUBARC')
        });
        state.materiasUi.selectedMateriaId = materiaId;
        applyPatchedSubmateriaCatalogRow(submateriaId, {
          estatus: 'archivada',
          archivado_at: new Date().toISOString(),
          archivado_por: String(state.session && state.session.usuario && state.session.usuario.facilitador_id || ''),
          fecha_actualizacion: new Date().toISOString()
        });
        renderAdminModuleSurface('materias');
        setBanner('Submateria archivada.', 'success');
      }, {
        button,
        key: buildActionKey('archivarSubmateria', [submateriaId]),
        busyText: 'Archivando...'
      });
    }

    async function toggleSubmateriaStatus(button, materiaId, submateriaId) {
      const row = getSubmateriasForMateria(materiaId).find((item) => item.submateria_id === String(submateriaId || '').trim());
      if (!row) throw new Error('Submateria no encontrada.');
      if (row.estatus === 'archivada') throw new Error('Usa la acci\u00f3n de reactivar para una submateria archivada.');
      const nextStatus = row.estatus === 'activa' ? 'inactiva' : 'activa';
      await handleAction('toggleSubmateriaStatus', async () => {
        await api('guardarSubmateria', {
          materia_id: materiaId,
          submateria_id: submateriaId,
          estatus: nextStatus,
          request_id: uid('SUBTOG')
        });
        state.materiasUi.selectedMateriaId = materiaId;
        applyPatchedSubmateriaCatalogRow(submateriaId, {
          estatus: nextStatus,
          archivado_at: '',
          archivado_por: '',
          fecha_actualizacion: new Date().toISOString()
        });
        renderAdminModuleSurface('materias');
        setBanner(nextStatus === 'activa' ? 'Submateria activada.' : 'Submateria desactivada.', 'success');
      }, {
        button,
        key: buildActionKey('toggleSubmateriaStatus', [submateriaId, nextStatus]),
        busyText: nextStatus === 'activa' ? 'Activando...' : 'Desactivando...'
      });
    }

    async function reactivateSubmateria(button, materiaId, submateriaId) {
      const row = getSubmateriasForMateria(materiaId).find((item) => item.submateria_id === String(submateriaId || '').trim());
      if (!row) throw new Error('Submateria no encontrada.');
      await handleAction('reactivateSubmateria', async () => {
        await api('guardarSubmateria', {
          materia_id: materiaId,
          submateria_id: submateriaId,
          estatus: 'activa',
          request_id: uid('SUBREA')
        });
        state.materiasUi.selectedMateriaId = materiaId;
        applyPatchedSubmateriaCatalogRow(submateriaId, {
          estatus: 'activa',
          archivado_at: '',
          archivado_por: '',
          fecha_actualizacion: new Date().toISOString()
        });
        renderAdminModuleSurface('materias');
        setBanner('Submateria reactivada.', 'success');
      }, {
        button,
        key: buildActionKey('reactivateSubmateria', [materiaId, submateriaId]),
        busyText: 'Reactivando...'
      });
    }

    async function moveSubmateria(button, materiaId, submateriaId, direction) {
      await handleAction('reordenarSubmateria', async () => {
        await api('reordenarSubmateria', {
          materia_id: materiaId,
          submateria_id: submateriaId,
          direction: direction,
          request_id: uid('SUBMOV')
        });
        state.materiasUi.selectedMateriaId = materiaId;
        const visibleRows = getSubmateriasForMateria(materiaId).filter((item) => item.estatus !== 'archivada');
        const currentIndex = visibleRows.findIndex((item) => item.submateria_id === String(submateriaId || '').trim());
        const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        if (currentIndex >= 0 && targetIndex >= 0 && targetIndex < visibleRows.length) {
          const current = visibleRows[currentIndex];
          const target = visibleRows[targetIndex];
          applyPatchedSubmateriaCatalogRow(current.submateria_id, { orden: target.orden });
          applyPatchedSubmateriaCatalogRow(target.submateria_id, { orden: current.orden });
        }
        renderAdminModuleSurface('materias');
      }, {
        button,
        key: buildActionKey('reordenarSubmateria', [submateriaId, direction]),
        busyText: direction === 'up' ? 'Subiendo...' : 'Bajando...'
      });
    }

    function bindAdminMateriasEvents() {
      if ($('adminMateriasSearch')) $('adminMateriasSearch').addEventListener('input', (event) => {
        state.materiasUi.search = event.currentTarget.value;
        scheduleUiDebounce('admin-materias-search', () => renderAdminMateriasModule());
      });
      if ($('adminMateriasFilterAllBtn')) $('adminMateriasFilterAllBtn').addEventListener('click', () => {
        state.materiasUi.filter = 'todas';
        renderAdminMateriasModule();
      });
      if ($('adminMateriasFilterActiveBtn')) $('adminMateriasFilterActiveBtn').addEventListener('click', () => {
        state.materiasUi.filter = 'activas';
        renderAdminMateriasModule();
      });
      if ($('adminMateriasFilterArchivedBtn')) $('adminMateriasFilterArchivedBtn').addEventListener('click', () => {
        state.materiasUi.filter = 'archivadas';
        renderAdminMateriasModule();
      });
      if ($('adminMateriasFilterVariantsBtn')) $('adminMateriasFilterVariantsBtn').addEventListener('click', () => {
        state.materiasUi.filter = 'con_submaterias';
        renderAdminMateriasModule();
      });
      if ($('adminMateriaNewBtn')) $('adminMateriaNewBtn').addEventListener('click', () => openMateriaEditor('new'));
      if ($('adminMateriaCancelBtn')) $('adminMateriaCancelBtn').addEventListener('click', () => {
        closeMateriaEditor();
        renderAdminMateriasModule();
      });
      if ($('adminMateriaSaveBtn')) $('adminMateriaSaveBtn').addEventListener('click', (event) => saveMateriaEditor(event.currentTarget));
    }

    function fillSelect(select, items, getValue, getLabel, placeholder = 'Selecciona') {
      const current = select.value;
      const options = ['<option value="">' + escapeHtml(placeholder) + '</option>'];
      items.forEach((item) => {
        const value = getValue(item);
        const label = getLabel(item);
        options.push('<option value="' + escapeHtml(value) + '">' + escapeHtml(label) + '</option>');
      });
      select.innerHTML = options.join('');
      if (current && items.some((item) => getValue(item) === current)) {
        select.value = current;
      }
    }

    function formatAlumnoCompactId(value) {
      const raw = String(value || '').trim();
      const match = raw.match(/^ALU-MIG-0*(\d+)$/i);
      if (!match) return raw;
      return 'ALU-' + String(match[1] || '').padStart(3, '0');
    }

    function getAlumnoCompactId(alumnoOrId) {
      const raw = alumnoOrId && typeof alumnoOrId === 'object'
        ? alumnoOrId.alumno_id
        : alumnoOrId;
      return formatAlumnoCompactId(raw);
    }

    function getAlumnoNameLabel(alumno) {
      const compactId = getAlumnoCompactId(alumno);
      return String(alumno && (alumno.nombre_mostrado || alumno.nombre_completo || alumno.nombre_snapshot) || compactId || '').trim();
    }

    function getAlumnoSecondaryLabel(alumno) {
      const matricula = formatAlumnoCompactId(alumno && alumno.matricula);
      return matricula || getAlumnoCompactId(alumno) || '-';
    }

    function joinUniqueAlumnoLabelParts(parts) {
      const seen = new Set();
      return (parts || [])
        .map((part) => String(part || '').trim())
        .filter((part) => {
          if (!part) return false;
          const key = part.toLowerCase();
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        })
        .join(' \u00b7 ');
    }

    function getAlumnoSelectLabel(alumno) {
      return joinUniqueAlumnoLabelParts([
        getAlumnoNameLabel(alumno),
        formatAlumnoCompactId(alumno && alumno.matricula),
        getAlumnoCompactId(alumno)
      ]);
    }

    function getAlumnoSearchLabels(alumno) {
      return [
        getAlumnoSelectLabel(alumno),
        joinUniqueAlumnoLabelParts([
          getAlumnoNameLabel(alumno),
          alumno && alumno.matricula,
          alumno && alumno.alumno_id
        ])
      ].filter(Boolean);
    }

    function renderPeriodSelects() {
      const periods = getAvailablePeriods();
      ['obsPeriodo', 'evaPeriodo', 'notaPeriodo', 'repPeriodo'].forEach((id) => {
        fillSelect($(id), periods, (p) => p.id, (p) => p.id + ' - ' + p.name, 'Selecciona per\u00edodo');
      });
      const reportUi = getReportSelectionState();
      if ($('repPeriodo') && reportUi.periodo_id) $('repPeriodo').value = reportUi.periodo_id;
      syncNotePeriodoState();
    }

    function createEmptyActivityDraft() {
      return {
        key: uid('ACTROW'),
        texto: '',
        material_en_carpeta: 'no_requiere',
        realizada: '',
        comentario_cierre: '',
        actividad_id: '',
        last_known_updated_at: ''
      };
    }

    function emptyPlanEditorState() {
      return {
        mode: 'create',
        planId: '',
        lockedSemanaId: '',
        lockedGrupoId: '',
        selectedSubmateriaId: '',
        selectedTallerId: '',
        validationErrors: {},
        lastKnownUpdatedAt: '',
        lastKnownActivitiesVersion: '',
        activities: [createEmptyActivityDraft()]
      };
    }

    function normalizeMaterialStatus(value) {
      const raw = String(value == null ? '' : value).trim().toLowerCase();
      if (!raw) return 'no_requiere';
      if (['listo', 'si', 's\u00ed', 'true', '1'].includes(raw)) return 'listo';
      if (['no_listo', 'no', 'false', '0'].includes(raw)) return 'no_listo';
      return 'no_requiere';
    }

    function normalizeRealizadaStatus(value) {
      const raw = String(value == null ? '' : value).trim().toLowerCase();
      if (['si', 's\u00ed', 'true', '1'].includes(raw)) return 'si';
      if (['no', 'false', '0'].includes(raw)) return 'no';
      return '';
    }

    function toYmdFrontend_(value) {
      if (value === undefined || value === null || value === '') return '';
      if (typeof value === 'string') {
        const trimmed = value.trim();
        if (!trimmed) return '';
        const match = trimmed.match(/^(\d{4}-\d{2}-\d{2})/);
        if (match) return match[1];
      }
      const date = new Date(value);
      if (isNaN(date.getTime())) return '';
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return year + '-' + month + '-' + day;
    }

    function formatFechaHumana(value) {
      const ymd = toYmdFrontend_(value);
      if (!ymd) return value ? String(value) : '';
      const [year, month, day] = ymd.split('-').map(Number);
      const date = new Date(year, (month || 1) - 1, day || 1);
      if (Number.isNaN(date.getTime())) return ymd;
      return date.toLocaleDateString('es-MX', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }

    function getSortedSemanas() {
      return [...state.catalogos.semanas].sort((a, b) => toYmdFrontend_(a.fecha_inicio).localeCompare(toYmdFrontend_(b.fecha_inicio)));
    }

    function getPlaneacionesFilterSemanas() {
      if (getCurrentRole() !== 'facilitador') return getSortedSemanas();
      const weekIds = new Set(getVisiblePlaneaciones()
        .map((plan) => String(plan && plan.semana_id || '').trim())
        .filter(Boolean));
      if (!weekIds.size) return [];
      const known = getSortedSemanas().filter((semana) => weekIds.has(String(semana && semana.semana_id || '').trim()));
      const knownIds = new Set(known.map((semana) => String(semana && semana.semana_id || '').trim()));
      const unknown = Array.from(weekIds)
        .filter((semanaId) => !knownIds.has(semanaId))
        .map((semanaId) => buildWeekRangeFromSemanaId(semanaId) || ({
          semana_id: semanaId,
          fecha_inicio: '',
          fecha_fin: '',
          nombre_visible: semanaId
        }));
      return known.concat(unknown);
    }

    function getWeekById(semanaId) {
      return state.catalogos.semanas.find((item) => item.semana_id === semanaId) || null;
    }

    function parseSemanaIdRange(semanaId) {
      const value = String(semanaId || '').trim();
      const match = value.match(/^SEM_(\d{4})(\d{2})(\d{2})(?:_(\d{4})(\d{2})(\d{2}))?$/);
      if (!match) return null;
      const start = toYmdFrontend_(match[1] + '-' + match[2] + '-' + match[3]);
      const end = match[4]
        ? toYmdFrontend_(match[4] + '-' + match[5] + '-' + match[6])
        : start;
      if (!start || !end) return null;
      return { start, end };
    }

    function buildWeekRangeFromSemanaId(semanaId) {
      const parsed = parseSemanaIdRange(semanaId);
      if (!parsed) return null;
      return {
        semana_id: String(semanaId || '').trim(),
        fecha_inicio: parsed.start,
        fecha_fin: parsed.end,
        nombre_visible: formatFechaCorta(parsed.start) + ' - ' + formatFechaCorta(parsed.end),
        cerrada_global: 'no',
        inferred: true
      };
    }

    function getWeekByIdOrInferred(semanaId) {
      const normalizedSemanaId = String(semanaId || '').trim();
      if (!normalizedSemanaId) return null;
      return getWeekById(normalizedSemanaId) || buildWeekRangeFromSemanaId(normalizedSemanaId);
    }

    function semanaContainsDate(semana, dateValue) {
      const target = toYmdFrontend_(dateValue);
      const start = toYmdFrontend_((semana && semana.fecha_inicio) || '');
      const end = toYmdFrontend_((semana && semana.fecha_fin) || '') || start;
      return !!(target && start && end && start <= target && target <= end);
    }

    function getSemanaRangeLengthDays(semana) {
      const start = toYmdFrontend_((semana && semana.fecha_inicio) || '');
      const end = toYmdFrontend_((semana && semana.fecha_fin) || '') || start;
      if (!start || !end || end < start) return null;
      const startMs = Date.parse(start + 'T12:00:00');
      const endMs = Date.parse(end + 'T12:00:00');
      if (!Number.isFinite(startMs) || !Number.isFinite(endMs)) return null;
      return Math.round((endMs - startMs) / 86400000) + 1;
    }

    function isOversizedSemanaRange(semana) {
      const lengthDays = getSemanaRangeLengthDays(semana);
      return Number.isFinite(lengthDays) && lengthDays > 7;
    }

    function resolveWeekForPlanDate(plan, dateValue) {
      const target = toYmdFrontend_(dateValue);
      const currentWeek = getWeekByIdOrInferred(plan && plan.semana_id);
      if (currentWeek && (!target || semanaContainsDate(currentWeek, target))) {
        return currentWeek;
      }
      return getWeekByDateOrDraft(target);
    }

    function getWeekStartDateById(semanaId) {
      const semana = getWeekById(semanaId);
      const catalogStart = toYmdFrontend_((semana && semana.fecha_inicio) || '');
      if (catalogStart) return catalogStart;
      const parsed = parseSemanaIdRange(semanaId);
      return parsed ? parsed.start : '';
    }

    function getWeekStartDateForPlan(plan) {
      return getWeekStartDateById(plan && plan.semana_id);
    }

    function buildWeekRangeFromDate(dateValue) {
      const target = toYmdFrontend_(dateValue);
      if (!target) return null;
      const base = new Date(target + 'T12:00:00');
      const day = base.getDay();
      const mondayOffset = day === 0 ? -6 : (1 - day);
      const fridayOffset = mondayOffset + 4;
      const from = new Date(base);
      from.setDate(base.getDate() + mondayOffset);
      const to = new Date(base);
      to.setDate(base.getDate() + fridayOffset);
      return {
        semana_id: '',
        fecha_inicio: toYmdFrontend_(from),
        fecha_fin: toYmdFrontend_(to),
        nombre_visible: 'Semana ' + toYmdFrontend_(from) + ' al ' + toYmdFrontend_(to),
        cerrada_global: 'no',
        draft: true
      };
    }

    function getWeekByDate(dateValue, options) {
      const target = toYmdFrontend_(dateValue);
      if (!target) return null;
      const ignoreOversized = !!(options && options.ignoreOversized);
      return getSortedSemanas().find((semana) => {
        if (ignoreOversized && isOversizedSemanaRange(semana)) return false;
        const start = toYmdFrontend_(semana.fecha_inicio);
        const end = toYmdFrontend_(semana.fecha_fin);
        return start && end && start <= target && target <= end;
      }) || null;
    }

    function getWeekByDateOrDraft(dateValue, options) {
      return getWeekByDate(dateValue, options) || buildWeekRangeFromDate(dateValue);
    }

    function getPlanEditorWeekByDateOrDraft(dateValue) {
      return getWeekByDateOrDraft(dateValue, { ignoreOversized: true });
    }

    function formatFechaCorta(value) {
      const ymd = toYmdFrontend_(value);
      if (!ymd) return '';
      const date = new Date(ymd + 'T12:00:00');
      if (isNaN(date.getTime())) return ymd;
      return date.toLocaleDateString('es-MX', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }).replace('.', '');
    }

    function formatSemanaLabel(semana) {
      if (!semana) return 'Semana sin resolver';
      const start = toYmdFrontend_(semana.fecha_inicio);
      const end = toYmdFrontend_(semana.fecha_fin);
      if (!start || !end) return semana.nombre_visible || semana.semana_id || 'Semana sin resolver';
      return formatFechaCorta(start) + ' - ' + formatFechaCorta(end);
    }

    function getSemanaHintText(semana) {
      return '';
    }

    function getWeekLabelForPlan(plan, semana) {
      if (semana) return formatSemanaLabel(semana);
      const weekId = String(plan && plan.semana_id || '').trim();
      const inferred = buildWeekRangeFromSemanaId(weekId);
      return inferred ? formatSemanaLabel(inferred) : (weekId || '-');
    }

    function getPlanStatusLabel(status) {
      return ({
        borrador: 'Borrador',
        borrador_pendiente_aprobacion: 'Pendiente de aprobaci\u00f3n',
        rechazada: 'Rechazada',
        activa: 'Activa',
        cierre_pendiente: 'Cierre pendiente',
        cerrada: 'Cerrada',
        archivada: 'Archivada'
      })[String(status || '').trim()] || String(status || 'Sin estado');
    }

    function getAdminPlanStatusSortWeight(status) {
      const value = String(status || '').trim();
      if (value === 'activa') return 0;
      if (['borrador', 'borrador_pendiente_aprobacion', 'rechazada', 'cierre_pendiente'].includes(value)) return 1;
      if (value === 'cerrada') return 2;
      if (value === 'archivada') return 3;
      return 1;
    }

    function sortAdminPlaneacionesByStatus(rows) {
      return (Array.isArray(rows) ? rows : [])
        .map((plan, index) => ({ plan, index }))
        .sort((a, b) => {
          const weightDiff = getAdminPlanStatusSortWeight(a.plan && a.plan.estado) - getAdminPlanStatusSortWeight(b.plan && b.plan.estado);
          return weightDiff || a.index - b.index;
        })
        .map((entry) => entry.plan);
    }

    function getPlanStatusFilterOptions() {
      const statusOrder = ['borrador', 'borrador_pendiente_aprobacion', 'rechazada', 'activa', 'cierre_pendiente', 'cerrada', 'archivada'];
      if (getCurrentRole() !== 'facilitador') {
        return statusOrder.map((status) => ({
          value: status,
          label: getPlanStatusLabel(status)
        }));
      }
      const visibleStatuses = new Set(getVisiblePlaneaciones()
        .map((plan) => String(plan && plan.estado || '').trim())
        .filter(Boolean));
      return ['borrador', 'activa']
        .filter((status) => visibleStatuses.has(status))
        .map((status) => ({
          value: status,
          label: getPlanStatusLabel(status)
        }));
    }

    function getPlanLocalSaveState(plan) {
      return String((plan && plan._local_save_state) || '').trim().toLowerCase();
    }

    function isPlaneacionLocalSavePending(plan) {
      return ['creating', 'saving', 'saving_silent', 'activating', 'syncing', 'sync_error'].includes(getPlanLocalSaveState(plan));
    }

    function getPlanStatusBadgeMeta(plan) {
      const localState = getPlanLocalSaveState(plan);
      const baseClass = String((plan && plan.estado) || '').trim();
      if (localState === 'creating') {
        return {
          className: baseClass,
          label: getPlanStatusLabel(plan && plan.estado)
        };
      }
      if (localState === 'saving') {
        return {
          className: baseClass,
          label: getPlanStatusLabel(plan && plan.estado)
        };
      }
      if (localState === 'activating') {
        return {
          className: baseClass,
          label: getPlanStatusLabel(plan && plan.estado)
        };
      }
      if (localState === 'sync_error') {
        return {
          className: ('is-local-pending ' + baseClass).trim(),
          label: 'Pendiente'
        };
      }
      return {
        className: baseClass,
        label: getPlanStatusLabel(plan && plan.estado)
      };
    }

    function getPlanLocalFeedbackMarkup(plan) {
      const message = String((plan && plan._local_save_message) || '').trim();
      const localState = getPlanLocalSaveState(plan);
      if (localState === 'saved') return '';
      if (!message && !['saving', 'saving_silent', 'activating'].includes(localState)) return '';
      const compactLabel = ({
        creating: 'Sincronizando',
        saving: 'Guardando',
        saving_silent: 'Actualizando',
        activating: 'Sincronizando',
        syncing: 'Sincronizando',
        sync_error: 'Pendiente'
      })[localState] || 'Actualizando';
      const toneClass = localState === 'sync_error' ? 'is-warning' : 'is-pending';
      const messageMarkup = ['creating', 'saving', 'saving_silent', 'syncing', 'activating'].includes(localState)
        ? ''
        : '<span class="plan-inline-feedback-text">' + escapeHtml(message) + '</span>';
      return (
        '<div class="plan-inline-feedback ' + toneClass + '">' +
          '<span class="plan-inline-feedback-dot" aria-hidden="true"></span>' +
          '<span class="plan-inline-feedback-label">' + escapeHtml(compactLabel) + '</span>' +
          messageMarkup +
        '</div>'
      );
    }

    function getPlanActionStatusMarkup(plan) {
      const localState = getPlanLocalSaveState(plan);
      if (localState === 'saved') return '';
      const label = ({
        sync_error: 'Pendiente'
      })[localState] || '';
      if (!label) return '';
      const toneClass = localState === 'sync_error' ? 'is-warning' : 'is-pending';
      return (
        '<span class="plan-action-status ' + toneClass + '">' +
          '<span class="plan-inline-feedback-dot" aria-hidden="true"></span>' +
          '<span>' + escapeHtml(label) + '</span>' +
        '</span>'
      );
    }

    function isPlaneacionPendingCreation(plan) {
      if (!plan) return false;
      const localState = getPlanLocalSaveState(plan);
      const planId = String((plan && plan.planeacion_id) || '').trim();
      return localState === 'creating' || /^tmppla/i.test(planId);
    }

    function isPlaneacionBlockedForActions(plan) {
      if (!plan) return false;
      const localState = getPlanLocalSaveState(plan);
      return isPlaneacionPendingCreation(plan) || ['creating', 'saving', 'saving_silent', 'activating', 'syncing'].includes(localState);
    }

    function notifyPlaneacionStillSyncing(button) {
      setBanner('Espera a que termine de guardarse la planeaci\u00f3n.', 'info', { button });
    }

    function focusPlaneacionCardSoon(planId) {
      const normalizedPlanId = String(planId || '').trim();
      if (!normalizedPlanId) return;
      window.requestAnimationFrame(() => {
        const card = $('plan-card-' + normalizedPlanId);
        if (!card || typeof card.scrollIntoView !== 'function') return;
        document.querySelectorAll('.plan-card.is-alert-focus').forEach((item) => {
          item.classList.remove('is-alert-focus');
          if (item._alertFocusTimer) {
            window.clearTimeout(item._alertFocusTimer);
            item._alertFocusTimer = null;
          }
        });
        card.classList.add('is-alert-focus');
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card._alertFocusTimer = window.setTimeout(() => {
          card.classList.remove('is-alert-focus');
          card._alertFocusTimer = null;
        }, 2200);
      });
    }

    function getCurrentUserId() {
      return String((state.session && state.session.usuario && state.session.usuario.facilitador_id) || '').trim();
    }

    function getSelectedGroupIds() {
      const host = $('planGruposChecklist');
      if (!host) return [];
      return Array.from(host.querySelectorAll('input[type="checkbox"]:checked')).map((input) => input.value);
    }

    function getSelectedPlanAlumnos() {
      return Array.from($('planAlumnosChecklist').querySelectorAll('input[type="checkbox"]:checked')).map((input) => input.value);
    }

    function createPlanEditorValidationError(message, fieldId) {
      const error = new Error(message);
      error.isPlanEditorValidation = true;
      error.focusTargetId = fieldId || '';
      return error;
    }

    function createInlineFieldValidationError(message, fieldId) {
      const error = new Error(message);
      error.isInlineFieldValidation = true;
      error.focusTargetId = fieldId || '';
      return error;
    }

    function getPlanEditorValidationErrors() {
      if (!state.planEditor) return {};
      if (!state.planEditor.validationErrors || typeof state.planEditor.validationErrors !== 'object') {
        state.planEditor.validationErrors = {};
      }
      return state.planEditor.validationErrors;
    }

    function getPlanEditorFieldErrorId(fieldId) {
      return 'planFieldError-' + String(fieldId || '').trim();
    }

    function getPlanEditorFieldErrorHost(fieldId) {
      const target = $(fieldId);
      if (!target) return null;
      if (fieldId === 'planGruposChecklist' || fieldId === 'planAlumnosChecklist' || fieldId === 'planActivitiesList') {
        return target.parentElement || target;
      }
      return target.closest('.plan-date-detected-field') || target.parentElement || target;
    }

    function ensurePlanEditorFieldErrorNode(fieldId) {
      const normalizedFieldId = String(fieldId || '').trim();
      if (!normalizedFieldId) return null;
      let node = $(getPlanEditorFieldErrorId(normalizedFieldId));
      if (node) return node;
      const host = getPlanEditorFieldErrorHost(normalizedFieldId);
      if (!host) return null;
      node = document.createElement('div');
      node.id = getPlanEditorFieldErrorId(normalizedFieldId);
      node.className = 'plan-field-error';
      node.setAttribute('role', 'alert');
      node.hidden = true;
      host.appendChild(node);
      return node;
    }

    function renderPlanEditorValidation() {
      const errors = getPlanEditorValidationErrors();
      ['planFecha', 'planMateria', 'planSubmateria', 'planGruposChecklist', 'planAlumnosChecklist', 'planActivitiesList'].forEach((fieldId) => {
        const target = $(fieldId);
        if (!target) return;
        const message = String(errors[fieldId] || '').trim();
        const node = ensurePlanEditorFieldErrorNode(fieldId);
        if (node) {
          node.textContent = message;
          node.hidden = !message;
        }
        target.classList.toggle('plan-field-invalid', !!message);
        if (message) {
          target.setAttribute('aria-invalid', 'true');
          if (node) target.setAttribute('aria-describedby', node.id);
        } else {
          target.removeAttribute('aria-invalid');
          if (node && target.getAttribute('aria-describedby') === node.id) {
            target.removeAttribute('aria-describedby');
          }
        }
      });
    }

    function clearPlanEditorValidation(fieldId) {
      const errors = getPlanEditorValidationErrors();
      if (fieldId) {
        delete errors[String(fieldId || '').trim()];
      } else {
        state.planEditor.validationErrors = {};
      }
      renderPlanEditorValidation();
    }

    function clearInlineFieldValidation(fieldId) {
      const normalizedFieldId = String(fieldId || '').trim();
      if (!normalizedFieldId) return;
      const target = $(normalizedFieldId);
      const node = $(getPlanEditorFieldErrorId(normalizedFieldId));
      if (node) {
        node.textContent = '';
        node.hidden = true;
      }
      if (target) {
        target.classList.remove('plan-field-invalid');
        target.removeAttribute('aria-invalid');
        if (node && target.getAttribute('aria-describedby') === node.id) {
          target.removeAttribute('aria-describedby');
        }
      }
    }

    function showInlineFieldValidationError(error) {
      if (!(error && error.isInlineFieldValidation)) return false;
      const fieldId = String(error.focusTargetId || '').trim();
      if (!fieldId) return false;
      const target = $(fieldId);
      if (!target) return false;
      const node = ensurePlanEditorFieldErrorNode(fieldId);
      if (node) {
        node.textContent = error.message || 'Revisa este campo.';
        node.hidden = false;
      }
      target.classList.add('plan-field-invalid');
      target.setAttribute('aria-invalid', 'true');
      if (node) target.setAttribute('aria-describedby', node.id);
      const scrollTarget = getPlanEditorFieldErrorHost(fieldId) || target;
      if (scrollTarget && typeof scrollTarget.scrollIntoView === 'function') {
        scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      if (target && typeof target.focus === 'function' && !['DIV', 'SECTION'].includes(String(target.tagName || '').toUpperCase())) {
        window.setTimeout(() => target.focus({ preventScroll: true }), 120);
      }
      return true;
    }

    function showPlanEditorValidationError(error) {
      if (!(error && error.isPlanEditorValidation)) return false;
      const fieldId = String(error.focusTargetId || '').trim();
      if (!fieldId) return false;
      const errors = getPlanEditorValidationErrors();
      Object.keys(errors).forEach((key) => delete errors[key]);
      errors[fieldId] = error.message || 'Revisa este campo.';
      if (state.ui) state.ui.planBuilderExpanded = true;
      renderPlanBuilderVisibility();
      renderPlanEditorValidation();
      const target = $(fieldId);
      const scrollTarget = getPlanEditorFieldErrorHost(fieldId) || target || $('planBuilderCard');
      if (scrollTarget && typeof scrollTarget.scrollIntoView === 'function') {
        scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      if (target && typeof target.focus === 'function' && !['planGruposChecklist', 'planAlumnosChecklist', 'planActivitiesList'].includes(fieldId)) {
        window.setTimeout(() => target.focus({ preventScroll: true }), 120);
      }
      return true;
    }

    function resetPlanEditor() {
      state.planEditor = emptyPlanEditorState();
      state.openPlanId = '';
      state.openPlanDraft = null;
      if (state.ui) state.ui.planBuilderExpanded = false;
      $('planFecha').value = '';
      $('planMateria').value = '';
      if ($('planSubmateria')) $('planSubmateria').value = '';
      $('planFrase').value = '';
      if ($('planGruposChecklist')) $('planGruposChecklist').innerHTML = '';
      if ($('planAlumnosChecklist')) $('planAlumnosChecklist').innerHTML = '';
      if ($('planActivitiesList')) $('planActivitiesList').innerHTML = '';
      renderPlanEditor();
      renderPlanBuilderVisibility();
      renderAlumnoFilterUi();
      if ($('planeacionesSectionTitle')) {
        $('planeacionesSectionTitle').textContent = canUseAdminShell() ? 'Planeaciones' : 'Planeaciones abiertas';
      }
      if ($('planeacionesSectionCopy')) {
        $('planeacionesSectionCopy').textContent = canUseAdminShell()
          ? 'Consulta hist\u00f3rico, filtra y corrige cualquier planeaci\u00f3n del sistema.'
          : 'Aquí puedes editar, observar y cerrar las planeaciones que siguen en trabajo.';
      }
    }

    function closePlanBuilder() {
      state.planEditor = emptyPlanEditorState();
      if (state.ui) state.ui.planBuilderExpanded = false;
      if ($('planFecha')) $('planFecha').value = '';
      if ($('planMateria')) $('planMateria').value = '';
      if ($('planSubmateria')) $('planSubmateria').value = '';
      if ($('planFrase')) $('planFrase').value = '';
      if ($('planGruposChecklist')) $('planGruposChecklist').innerHTML = '';
      if ($('planAlumnosChecklist')) $('planAlumnosChecklist').innerHTML = '';
      if ($('planActivitiesList')) $('planActivitiesList').innerHTML = '';
      renderPlanEditor();
      renderPlanBuilderVisibility();
    }

    function loadPlanIntoEditor(plan) {
      state.openPlanId = plan.planeacion_id;
      state.openPlanDraft = null;
      if (state.ui) state.ui.planBuilderExpanded = true;
      state.planEditor = {
        mode: 'edit',
        planId: plan.planeacion_id,
        lockedSemanaId: plan.semana_id,
        lockedGrupoId: plan.grupo_id,
        selectedSubmateriaId: plan.submateria_id || '',
        selectedTallerId: '',
        lastKnownUpdatedAt: plan.fecha_actualizacion || '',
        lastKnownActivitiesVersion: plan.actividades_version_actual || '',
        activities: (plan.actividades || []).length ? (plan.actividades || []).map((actividad) => ({
          key: actividad.actividad_id || uid('ACTROW'),
          actividad_id: actividad.actividad_id || '',
          texto: actividad.texto || '',
          material_en_carpeta: normalizeMaterialStatus(actividad.material_en_carpeta),
          realizada: normalizeRealizadaStatus(actividad.realizada),
          comentario_cierre: actividad.comentario_cierre || '',
          last_known_updated_at: actividad.fecha_actualizacion || ''
        })) : [createEmptyActivityDraft()]
      };
      $('planFecha').value = getWeekStartDateForPlan(plan);
      $('planFrase').value = plan.frase_semana || '';
      $('planMateria').value = plan.materia_id || '';
      syncPlanSubmateriaSelect(plan.submateria_id || '');
      renderPlanEditor();
      renderPlanBuilderVisibility();
      Array.from($('planAlumnosChecklist').querySelectorAll('input[type="checkbox"]')).forEach((input) => {
        input.checked = (plan.alumnos || []).some((row) => row.alumno_id === input.value);
      });
    }

    function buildOpenPlanDraft(plan) {
      const snapshotOpenPlan = getBootSnapshotOpenPlanById(plan.planeacion_id);
      const sourcePlan = (
        plan &&
        (
          (Array.isArray(plan.alumnos) && plan.alumnos.length) ||
          (Array.isArray(plan.actividades) && plan.actividades.length)
        )
      )
        ? plan
        : Object.assign({}, snapshotOpenPlan || {}, plan || {});
      const finalObservationsByKey = Object.assign({}, sourcePlan._draft_final_observations_by_key || {});
      (Array.isArray(sourcePlan.obs_alumno_final) ? sourcePlan.obs_alumno_final : []).forEach((row) => {
        const alumnoId = String((row && row.alumno_id) || '').trim();
        const targetPlanId = String((row && row.planeacion_id) || plan.planeacion_id || '').trim();
        const nota = String((row && row.nota) || '').trim();
        if (!alumnoId) return;
        finalObservationsByKey[alumnoId] = nota;
        if (targetPlanId) finalObservationsByKey[targetPlanId + '::' + alumnoId] = nota;
      });
      const generalObservationText = String(
        sourcePlan._draft_general_observation_text ||
        ''
      ).trim();
      return {
        planId: plan.planeacion_id,
        fecha_planeacion: getWeekStartDateForPlan(plan),
        frase_semana: sourcePlan.frase_semana || '',
        materia_id: sourcePlan.materia_id || '',
        submateria_id: sourcePlan.submateria_id || '',
        taller_id: sourcePlan.taller_id || '',
        alumnos_ids: (sourcePlan.alumnos || []).map((row) => row.alumno_id),
        original_alumnos_ids: (sourcePlan.alumnos || []).map((row) => row.alumno_id),
        activities: (sourcePlan.actividades || []).length ? (sourcePlan.actividades || []).map((actividad) => ({
          key: actividad.actividad_id || uid('ACTOPEN'),
          actividad_id: actividad.actividad_id || '',
          texto: actividad.texto || '',
          material_en_carpeta: normalizeMaterialStatus(actividad.material_en_carpeta),
          realizada: normalizeRealizadaStatus(actividad.realizada),
          comentario_cierre: actividad.comentario_cierre || '',
          last_known_updated_at: actividad.fecha_actualizacion || ''
        })) : [createEmptyActivityDraft()],
        generalObservationText,
        finalObservationsByKey,
        lastKnownUpdatedAt: plan.fecha_actualizacion || '',
        lastKnownActivitiesVersion: plan.actividades_version_actual || '',
        generalObservationDirty: false,
        activitiesDirty: false
      };
    }

    function preserveOpenPlanDraftLocalNotes(planId, draft, planLike = null) {
      if (!draft || !draft.planId) return draft;
      const normalizedPlanId = String(planId || draft.planId || '').trim();
      const currentPlan = planLike || getPlanById(normalizedPlanId) || null;
      const currentDraft = state.openPlanDraft && String(state.openPlanDraft.planId || '').trim() === normalizedPlanId
        ? state.openPlanDraft
        : null;
      const nextDraft = cloneJsonSafe(draft, draft) || draft;
      const generalText = String(
        (currentDraft && currentDraft.generalObservationText) ||
        (currentPlan && currentPlan._draft_general_observation_text) ||
        nextDraft.generalObservationText ||
        ''
      );
      if (generalText) {
        nextDraft.generalObservationText = generalText;
      }
      nextDraft.finalObservationsByKey = Object.assign(
        {},
        nextDraft.finalObservationsByKey || {},
        (currentPlan && currentPlan._draft_final_observations_by_key) || {},
        (currentDraft && currentDraft.finalObservationsByKey) || {}
      );
      return nextDraft;
    }

    function preserveOpenPlanDraftLocalEdits(planId, draft, planLike = null) {
      const nextDraft = preserveOpenPlanDraftLocalNotes(planId, draft, planLike);
      const normalizedPlanId = String(planId || (nextDraft && nextDraft.planId) || '').trim();
      const currentDraft = state.openPlanDraft && String(state.openPlanDraft.planId || '').trim() === normalizedPlanId
        ? state.openPlanDraft
        : null;
      if (!nextDraft || !currentDraft) return nextDraft;
      ['fecha_planeacion', 'frase_semana', 'materia_id', 'submateria_id', 'taller_id'].forEach((field) => {
        if (currentDraft[field] !== undefined) nextDraft[field] = currentDraft[field];
      });
      if (Array.isArray(currentDraft.alumnos_ids)) {
        nextDraft.alumnos_ids = currentDraft.alumnos_ids.slice();
      }
      if (currentDraft.generalObservationDirty === true) {
        nextDraft.generalObservationDirty = true;
      }
      if (currentDraft.activitiesDirty && Array.isArray(currentDraft.activities) && currentDraft.activities.length) {
        nextDraft.activities = cloneJsonSafe(currentDraft.activities, currentDraft.activities) || currentDraft.activities.slice();
        nextDraft.activitiesDirty = true;
      }
      return nextDraft;
    }

    function hasUsableOpenPlanDetail(plan) {
      if (!plan || !plan.planeacion_id) return false;
      const alumnosReady = Number(plan.alumnos_count || 0) === 0 || (Array.isArray(plan.alumnos) && plan.alumnos.length > 0);
      const actividadesReady = Number(plan.actividades_count || 0) === 0 || (Array.isArray(plan.actividades) && plan.actividades.length > 0);
      return alumnosReady && actividadesReady;
    }

    function isOpenPlanReadyForSave(plan, entry = null) {
      if (!plan || !plan.planeacion_id) return false;
      const planId = String(plan.planeacion_id || '').trim();
      if (!planId) return false;
      if (state.ui && String(state.ui.openPlanLoadingId || '').trim() === planId) return false;
      if (!plan.detail_loaded || !hasUsableOpenPlanDetail(plan)) return false;
      if (entry && entry.isMulti) {
        const childPlans = Array.isArray(entry.plans) ? entry.plans : [];
        if (!childPlans.length) return false;
        return childPlans.every((childPlan) => {
          const childPlanId = String((childPlan && childPlan.planeacion_id) || '').trim();
          const currentChildPlan = childPlanId ? (getPlanById(childPlanId) || childPlan) : childPlan;
          return !!(currentChildPlan && currentChildPlan.detail_loaded && hasUsableOpenPlanDetail(currentChildPlan));
        });
      }
      return true;
    }

    function shouldKeepOpenPlanInlineDetail(planId, planLike = null) {
      const normalizedPlanId = String(planId || '').trim();
      if (!normalizedPlanId) return false;
      if (shouldPreserveSnapshotPlanDetail(normalizedPlanId)) return true;
      if (String(state.openPlanId || '').trim() !== normalizedPlanId) return false;
      const currentPlan = planLike || getPlanById(normalizedPlanId);
      return !!(currentPlan && currentPlan.detail_loaded && hasUsableOpenPlanDetail(currentPlan));
    }

    function hasUsableOpenPlanDraftData(draft, plan) {
      if (!draft || !plan) return false;
      const alumnosReady = Number(plan.alumnos_count || 0) === 0 || (Array.isArray(draft.alumnos_ids) && draft.alumnos_ids.length > 0);
      const actividadesReady = Number(plan.actividades_count || 0) === 0 || (Array.isArray(draft.activities) && draft.activities.some((activity) => String((activity && activity.texto) || '').trim() || String((activity && activity.actividad_id) || '').trim()));
      return alumnosReady && actividadesReady;
    }

    function getCurrentPlanFechaPlaneacion(plan) {
      return getWeekStartDateForPlan(plan);
    }

    function buildOpenPlanStructuralSignatureFromDraft(draft) {
      if (!draft) return '';
      return JSON.stringify({
        fecha_planeacion: String(draft.fecha_planeacion || '').trim(),
        frase_semana: String(draft.frase_semana || '').trim(),
        materia_id: String(draft.materia_id || '').trim(),
        submateria_id: String(draft.submateria_id || '').trim(),
        taller_id: String(draft.taller_id || '').trim(),
        alumnos_ids: normalizeIdList(draft.alumnos_ids),
        activities: (Array.isArray(draft.activities) ? draft.activities : [])
          .map((activity, index) => ({
            actividad_id: String((activity && activity.actividad_id) || '').trim(),
            texto: String((activity && activity.texto) || '').trim(),
            orden: index + 1
          }))
          .filter((activity) => activity.texto || activity.actividad_id)
      });
    }

    function buildOpenPlanStructuralSignatureFromPlan(plan) {
      if (!plan) return '';
      return JSON.stringify({
        fecha_planeacion: getCurrentPlanFechaPlaneacion(plan),
        frase_semana: String(plan.frase_semana || '').trim(),
        materia_id: String(plan.materia_id || '').trim(),
        submateria_id: String(plan.submateria_id || '').trim(),
        taller_id: String(plan.taller_id || '').trim(),
        alumnos_ids: normalizeIdList((plan.alumnos || []).map((row) => row && row.alumno_id)),
        activities: (Array.isArray(plan.actividades) ? plan.actividades : [])
          .map((activity, index) => ({
            actividad_id: String((activity && activity.actividad_id) || '').trim(),
            texto: String((activity && activity.texto) || '').trim(),
            orden: index + 1
          }))
          .filter((activity) => activity.texto || activity.actividad_id)
      });
    }

    function buildMultiGroupSharedSignatureFromDraft(draft) {
      if (!draft) return '';
      return JSON.stringify({
        fecha_planeacion: String(draft.fecha_planeacion || '').trim(),
        frase_semana: String(draft.frase_semana || '').trim(),
        materia_id: String(draft.materia_id || '').trim(),
        submateria_id: String(draft.submateria_id || '').trim(),
        taller_id: String(draft.taller_id || '').trim(),
        activities: (Array.isArray(draft.activities) ? draft.activities : [])
          .map((activity, index) => ({
            actividad_id: String((activity && activity.actividad_id) || '').trim(),
            texto: String((activity && activity.texto) || '').trim(),
            material_en_carpeta: normalizeMaterialStatus((activity && activity.material_en_carpeta) || 'no_requiere'),
            realizada: normalizeRealizadaStatus((activity && activity.realizada) || ''),
            comentario_cierre: String((activity && activity.comentario_cierre) || '').trim(),
            orden: index + 1
          }))
          .filter((activity) => activity.texto || activity.actividad_id)
      });
    }

    function buildMultiGroupSharedSignatureFromPlan(plan) {
      if (!plan) return '';
      return JSON.stringify({
        fecha_planeacion: getCurrentPlanFechaPlaneacion(plan),
        frase_semana: String(plan.frase_semana || '').trim(),
        materia_id: String(plan.materia_id || '').trim(),
        submateria_id: String(plan.submateria_id || '').trim(),
        taller_id: String(plan.taller_id || '').trim(),
        activities: (Array.isArray(plan.actividades) ? plan.actividades : [])
          .map((activity, index) => ({
            actividad_id: String((activity && activity.actividad_id) || '').trim(),
            texto: String((activity && activity.texto) || '').trim(),
            material_en_carpeta: normalizeMaterialStatus((activity && activity.material_en_carpeta) || 'no_requiere'),
            realizada: normalizeRealizadaStatus((activity && activity.realizada) || ''),
            comentario_cierre: String((activity && activity.comentario_cierre) || '').trim(),
            orden: index + 1
          }))
          .filter((activity) => activity.texto || activity.actividad_id)
      });
    }

    function didMultiGroupSharedDraftChange(entry, draft) {
      if (!entry || !entry.isMulti || !draft) return false;
      const selectedPlan = getOpenPlaneacionEntry(entry) || entry.representative || null;
      if (!selectedPlan) return false;
      return buildMultiGroupSharedSignatureFromDraft(draft) !== buildMultiGroupSharedSignatureFromPlan(selectedPlan);
    }

    function getOpenPlanStructuralDraftState(planId, fallbackPlan) {
      const currentPlan = getPlanById(planId) || fallbackPlan || null;
      const draft = currentPlan ? getOpenPlanDraft(currentPlan) : null;
      if (!currentPlan || !draft) {
        return {
          dirty: false,
          hasActivitiesWithoutId: false
        };
      }
      const activities = Array.isArray(draft.activities) ? draft.activities : [];
      const hasActivitiesWithoutId = activities.some((activity) => {
        return String((activity && activity.texto) || '').trim() &&
          !String((activity && activity.actividad_id) || '').trim();
      });
      const dirty = buildOpenPlanStructuralSignatureFromDraft(draft) !== buildOpenPlanStructuralSignatureFromPlan(currentPlan);
      return {
        dirty,
        hasActivitiesWithoutId
      };
    }

    function getOpenPlanDraft(plan) {
      if (!plan) return null;
      if (state.openPlanDraft && state.openPlanDraft.planId === plan.planeacion_id && !hasUsableOpenPlanDraftData(state.openPlanDraft, plan)) {
        state.openPlanDraft = null;
      }
      if (!state.openPlanDraft || state.openPlanDraft.planId !== plan.planeacion_id) {
        if (!hasUsableOpenPlanDetail(plan)) return null;
        state.openPlanDraft = buildOpenPlanDraft(plan);
      }
      return state.openPlanDraft;
    }

    function updateOpenPlanDraftField(field, value, rerender) {
      if (!state.openPlanDraft) return;
      const fieldMap = {
        fecha_planeacion: 'fecha',
        materia_id: 'materia',
        submateria_id: 'submateria',
        taller_id: 'submateria'
      };
      if (fieldMap[field]) {
        clearInlineFieldValidation(getOpenPlanInlineFieldId(state.openPlanDraft, fieldMap[field]));
      }
      state.openPlanDraft[field] = value;
      if (field === 'materia_id') {
        const nextMateriaId = String(value || '').trim();
        const currentSubmateriaId = String(state.openPlanDraft.submateria_id || '').trim();
        const hasMatchingSubmateria = currentSubmateriaId && getPlanSubmateriasForMateria(nextMateriaId).some((item) => String(item.submateria_id || '').trim() === currentSubmateriaId);
        state.openPlanDraft.submateria_id = hasMatchingSubmateria ? currentSubmateriaId : '';
      }
      persistOpenPlanSnapshotSoon('planeacion_draft_campo');
      if (rerender) renderPlaneacionesList();
    }

    function toggleOpenPlanDraftAlumno(alumnoId, checked) {
      if (!state.openPlanDraft) return;
      clearInlineFieldValidation(getOpenPlanInlineFieldId(state.openPlanDraft, 'alumnos'));
      const current = new Set(state.openPlanDraft.alumnos_ids || []);
      if (checked) current.add(alumnoId); else current.delete(alumnoId);
      state.openPlanDraft.alumnos_ids = Array.from(current);
      persistOpenPlanSnapshotSoon('planeacion_draft_alumnos');
    }

    function updateOpenPlanDraftActivityField(index, field, value) {
      if (!state.openPlanDraft || !state.openPlanDraft.activities[index]) return;
      clearInlineFieldValidation(getOpenPlanInlineFieldId(state.openPlanDraft, 'activities'));
      state.openPlanDraft.activities[index][field] = value;
      state.openPlanDraft.activitiesDirty = true;
      persistOpenPlanSnapshotSoon('planeacion_draft_actividad');
    }

    function updateOpenPlanFinalObservationDraft(planId, alumnoId, value) {
      if (!state.openPlanDraft) return;
      const normalizedAlumnoId = String(alumnoId || '').trim();
      const normalizedPlanId = String(planId || state.openPlanDraft.planId || '').trim();
      if (!normalizedAlumnoId) return;
      if (!state.openPlanDraft.finalObservationsByKey || typeof state.openPlanDraft.finalObservationsByKey !== 'object') {
        state.openPlanDraft.finalObservationsByKey = {};
      }
      const normalizedValue = String(value || '');
      state.openPlanDraft.finalObservationsByKey[normalizedAlumnoId] = normalizedValue;
      if (normalizedPlanId) {
        state.openPlanDraft.finalObservationsByKey[normalizedPlanId + '::' + normalizedAlumnoId] = normalizedValue;
      }
      const currentPlan = getPlanById(normalizedPlanId);
      if (currentPlan && currentPlan.planeacion_id) {
        const nextDraftMap = Object.assign({}, currentPlan._draft_final_observations_by_key || {});
        if (normalizedValue) {
          nextDraftMap[normalizedAlumnoId] = normalizedValue;
          if (normalizedPlanId) nextDraftMap[normalizedPlanId + '::' + normalizedAlumnoId] = normalizedValue;
        } else {
          delete nextDraftMap[normalizedAlumnoId];
          if (normalizedPlanId) delete nextDraftMap[normalizedPlanId + '::' + normalizedAlumnoId];
        }
        upsertPlaneacionRow({
          planeacion_id: normalizedPlanId,
          _draft_final_observations_by_key: nextDraftMap
        });
      }
      persistOpenPlanSnapshotSoon('planeacion_draft_obs_final');
    }

    function applyPendingPlanObservationDraft(planId, generalText, finalPayloads) {
      const normalizedPlanId = String(planId || '').trim();
      if (!normalizedPlanId) return;
      const currentPlan = getPlanById(normalizedPlanId);
      const draft = state.openPlanDraft && String(state.openPlanDraft.planId || '').trim() === normalizedPlanId
        ? state.openPlanDraft
        : null;
      let nextFinalMap = Object.assign({}, (currentPlan && currentPlan._draft_final_observations_by_key) || {});
      const trimmedGeneral = String(generalText || '').trim();
      if (draft) {
        draft.generalObservationText = trimmedGeneral;
      }
      if (Array.isArray(finalPayloads) && finalPayloads.length) {
        finalPayloads.forEach((row) => {
          const alumnoId = String((row && row.alumnoId) || '').trim();
          const targetPlanId = String((row && (row.planId || normalizedPlanId)) || '').trim();
          const nota = String((row && row.nota) || '').trim();
          if (!alumnoId) return;
          if (draft) {
            if (!draft.finalObservationsByKey || typeof draft.finalObservationsByKey !== 'object') {
              draft.finalObservationsByKey = {};
            }
            draft.finalObservationsByKey[alumnoId] = nota;
            if (targetPlanId) draft.finalObservationsByKey[targetPlanId + '::' + alumnoId] = nota;
          }
          nextFinalMap[alumnoId] = nota;
          if (targetPlanId) nextFinalMap[targetPlanId + '::' + alumnoId] = nota;
        });
      }
      const patch = {
        planeacion_id: normalizedPlanId,
        _draft_general_observation_text: trimmedGeneral,
        _draft_final_observations_by_key: nextFinalMap
      };
      upsertPlaneacionRow(patch);
      persistOpenPlanSnapshotSoon('planeacion_draft_obs_bundle');
    }

    function syncOpenPlanDraftConcurrencyHints(plan, draft) {
      if (!plan || !draft) return draft;
      const latestPlanUpdatedAt = String((plan && plan.fecha_actualizacion) || '').trim();
      const latestActivitiesVersion = String((plan && plan.actividades_version_actual) || '').trim();
      if (latestPlanUpdatedAt) {
        draft.lastKnownUpdatedAt = latestPlanUpdatedAt;
      }
      if (latestActivitiesVersion) {
        draft.lastKnownActivitiesVersion = latestActivitiesVersion;
      }
      if (Array.isArray(draft.activities) && Array.isArray(plan.actividades) && plan.actividades.length) {
        const activitiesById = new Map(
          plan.actividades
            .map((activity) => [String((activity && activity.actividad_id) || '').trim(), activity])
            .filter((entry) => entry[0])
        );
        draft.activities.forEach((activity) => {
          const activityId = String((activity && activity.actividad_id) || '').trim();
          if (!activityId) return;
          const currentActivity = activitiesById.get(activityId);
          const latestActivityUpdatedAt = String((currentActivity && currentActivity.fecha_actualizacion) || '').trim();
          if (latestActivityUpdatedAt) {
            activity.last_known_updated_at = latestActivityUpdatedAt;
          }
        });
      }
      return draft;
    }

    function syncOpenPlanDraftFromVisibleControls(draft) {
      if (!draft || !Array.isArray(draft.activities) || !draft.activities.length) return draft;
      draft.activities = draft.activities.map((activity) => {
        const nextActivity = Object.assign({}, activity || {});
        const activityId = String((nextActivity && nextActivity.actividad_id) || '').trim();
        if (!activityId) return nextActivity;
        const realizadaNode = $('activity-realizada-' + activityId);
        const materialNode = $('activity-material-' + activityId);
        const comentarioNode = $('activity-comment-' + activityId);
        if (realizadaNode) {
          nextActivity.realizada = normalizeRealizadaStatus(realizadaNode.value);
        }
        if (materialNode) {
          nextActivity.material_en_carpeta = normalizeMaterialStatus(materialNode.value);
        }
        if (comentarioNode) {
          nextActivity.comentario_cierre = String(comentarioNode.value || '').trim();
        }
        return nextActivity;
      });
      return draft;
    }

    function addOpenPlanDraftActivity() {
      if (!state.openPlanDraft) return;
      state.openPlanDraft.activities.push(createEmptyActivityDraft());
      state.openPlanDraft.activitiesDirty = true;
      persistOpenPlanSnapshotSoon('planeacion_draft_actividad');
      renderPlaneacionesList();
    }

    function removeOpenPlanDraftActivity(index) {
      if (!state.openPlanDraft || state.openPlanDraft.activities.length <= 1) return;
      state.openPlanDraft.activities.splice(index, 1);
      state.openPlanDraft.activitiesDirty = true;
      persistOpenPlanSnapshotSoon('planeacion_draft_actividad');
      renderPlaneacionesList();
    }

    function moveOpenPlanDraftActivity(index, direction) {
      if (!state.openPlanDraft) return;
      const target = index + direction;
      if (target < 0 || target >= state.openPlanDraft.activities.length) return;
      const copy = [...state.openPlanDraft.activities];
      const temp = copy[index];
      copy[index] = copy[target];
      copy[target] = temp;
      state.openPlanDraft.activities = copy;
      state.openPlanDraft.activitiesDirty = true;
      persistOpenPlanSnapshotSoon('planeacion_draft_actividad');
      renderPlaneacionesList();
    }

    function toggleAllOpenPlanDraftAlumnos(checked) {
      if (!state.openPlanDraft || !state.openPlanId) return;
      const plan = getPlanById(state.openPlanId);
      if (!plan) return;
      const alumnosGrupo = state.catalogos.alumnos
        .filter((alumno) => alumno.grupo_id === plan.grupo_id)
        .map((alumno) => alumno.alumno_id);
      clearInlineFieldValidation(getOpenPlanInlineFieldId(plan, 'alumnos'));
      state.openPlanDraft.alumnos_ids = checked ? alumnosGrupo : [];
      persistOpenPlanSnapshotSoon('planeacion_draft_alumnos');
      renderPlaneacionesList();
    }

    function formatPlanShort(plan) {
      const materia = getMateriaById(plan.materia_id);
      const grupo = getGrupoById(plan.grupo_id);
      const semana = state.catalogos.semanas.find((item) => item.semana_id === plan.semana_id);
      const displaySemana = semana || buildWeekRangeFromSemanaId(plan.semana_id);
      return [
        grupo ? getGrupoDisplayName(grupo) : plan.grupo_id,
        getPlanMateriaDisplayLabel(plan, materia),
        displaySemana ? formatSemanaLabel(displaySemana) : plan.semana_id
      ].join(' · ');
    }

    function getPlanSubmateriasForMateria(materiaId) {
      const targetId = String(materiaId || '').trim();
      if (!targetId) return [];
      return (state.catalogos.submaterias || []).filter((item) => String(item.materia_id || '').trim() === targetId);
    }

    function getSubmateriaById(submateriaId) {
      const targetId = String(submateriaId || '').trim();
      if (!targetId) return null;
      return (state.catalogos.submaterias || []).find((item) => String(item.submateria_id || '').trim() === targetId) || null;
    }

    function materiaRequiresPlanSubmateria(materiaId) {
      return getPlanSubmateriasForMateria(materiaId).length > 0;
    }

    function normalizePlanCatalogLabel(value) {
      return String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .toLowerCase();
    }

    function isPlanTallerMateria(materiaId) {
      const targetId = String(materiaId || '').trim();
      if (!targetId) return false;
      const materia = getMateriaById(targetId);
      const label = normalizePlanCatalogLabel(materia ? (materia.nombre || materia.materia_id) : targetId);
      return label === 'taller' || label === 'talleres';
    }

    function getDefaultPlanSubmateriaIdForMateria(materiaId) {
      const submaterias = getPlanSubmateriasForMateria(materiaId);
      return String((submaterias[0] && submaterias[0].submateria_id) || '').trim();
    }

    function getPlanEditorUsesTallerSelector(materiaId) {
      return state.planEditor.mode !== 'edit' &&
        isPlanTallerMateria(materiaId) &&
        getPlanEditorTallerOptions().length > 0;
    }

    function getPlanEditorSelectedSubmateriaId(materiaId) {
      const targetMateriaId = String(materiaId || ($('planMateria') && $('planMateria').value) || '').trim();
      if (getPlanEditorUsesTallerSelector(targetMateriaId)) {
        const fallbackId = getDefaultPlanSubmateriaIdForMateria(targetMateriaId);
        if (!state.planEditor.selectedSubmateriaId && fallbackId) {
          state.planEditor.selectedSubmateriaId = fallbackId;
        }
        return String(state.planEditor.selectedSubmateriaId || fallbackId || '').trim();
      }
      return String(($('planSubmateria') && $('planSubmateria').value) || state.planEditor.selectedSubmateriaId || '').trim();
    }

    function getPlanMateriaDisplayLabel(plan, materiaRow) {
      const materia = materiaRow || getMateriaById(plan.materia_id);
      const materiaLabel = materia
        ? (materia.nombre || materia.materia_id)
        : (plan.materia_nombre || plan.materia_id || '-');
      const tallerId = String((plan && plan.taller_id) || '').trim();
      const taller = tallerId ? getTallerById(tallerId) : null;
      const submateria = tallerId ? null : getSubmateriaById(plan && plan.submateria_id);
      const submateriaLabel = submateria
        ? (submateria.nombre || submateria.submateria_id)
        : (taller
          ? (taller.nombre || taller.taller_id)
          : (plan && plan.submateria_nombre ? String(plan.submateria_nombre).trim() : ''));
      return submateriaLabel ? (materiaLabel + ' \u00b7 ' + submateriaLabel) : materiaLabel;
    }

    function syncPlanSubmateriaSelect(preferredValue) {
      const field = $('planSubmateriaField');
      const select = $('planSubmateria');
      const materiaId = $('planMateria') ? $('planMateria').value : '';
      if (!field || !select) return;
      const label = field.querySelector('label');
      const useTallerSelector = getPlanEditorUsesTallerSelector(materiaId);
      if (useTallerSelector) {
        const talleres = getPlanEditorTallerOptions();
        field.hidden = false;
        if (label) label.textContent = 'Taller';
        fillSelect(select, talleres, (item) => item.taller_id, (item) => item.nombre || item.taller_id, 'Selecciona taller');
        const nextTallerId = String(state.planEditor.selectedTallerId || '').trim();
        if (nextTallerId && talleres.some((item) => String(item.taller_id || '').trim() === nextTallerId)) {
          select.value = nextTallerId;
        } else {
          select.value = '';
          state.planEditor.selectedTallerId = '';
        }
        state.planEditor.selectedSubmateriaId = getDefaultPlanSubmateriaIdForMateria(materiaId);
        select.disabled = !!(state.ui && state.ui.planeacionesCatalogosLoading);
        return;
      }
      const submaterias = getPlanSubmateriasForMateria(materiaId);
      field.hidden = !submaterias.length;
      if (label) label.textContent = 'Submateria';
      fillSelect(select, submaterias, (item) => item.submateria_id, (item) => item.nombre || item.submateria_id, 'Selecciona submateria');
      const nextValue = preferredValue !== undefined ? String(preferredValue || '').trim() : String(state.planEditor.selectedSubmateriaId || '').trim();
      if (nextValue && submaterias.some((item) => item.submateria_id === nextValue)) {
        select.value = nextValue;
      } else {
        select.value = '';
      }
      state.planEditor.selectedSubmateriaId = select.value || '';
      select.disabled = !submaterias.length || (state.ui && state.ui.planeacionesCatalogosLoading);
    }

    function getPlanById(planId) {
      return getPlaneacionesIndex().byId.get(String(planId || '').trim()) || null;
    }

    function getPlanByActivityId(activityId) {
      const normalizedActivityId = String(activityId || '').trim();
      if (!normalizedActivityId) return null;
      return (state.planeaciones || []).find((plan) =>
        Array.isArray(plan && plan.actividades) &&
        plan.actividades.some((actividad) => String((actividad && actividad.actividad_id) || '').trim() === normalizedActivityId)
      ) || null;
    }

    function getPlanAlumnoCount(plan) {
      if (!plan) return 0;
      if (Array.isArray(plan.alumnos) && plan.alumnos.length) return plan.alumnos.length;
      return Number(plan.alumnos_count || 0);
    }

    function getPlanActividadCount(plan) {
      if (!plan) return 0;
      if (Array.isArray(plan.actividades) && plan.actividades.length) return plan.actividades.length;
      return Number(plan.actividades_count || 0);
    }

    function getPlanLoteId(plan) {
      return String((plan && plan.planeacion_lote_id) || '').trim();
    }

    function getPlaneacionEntryKey(plan) {
      const loteId = getPlanLoteId(plan);
      return loteId ? ('lote:' + loteId) : ('plan:' + String((plan && plan.planeacion_id) || '').trim());
    }

    function buildPlaneacionEntries(plans) {
      const source = Array.isArray(plans) ? plans : [];
      const entries = [];
      const index = {};
      source.forEach((plan) => {
        const key = getPlaneacionEntryKey(plan);
        if (!index[key]) {
          index[key] = {
            key,
            loteId: getPlanLoteId(plan),
            isMulti: !!getPlanLoteId(plan),
            representative: plan,
            plans: []
          };
          entries.push(index[key]);
        }
        index[key].plans.push(plan);
      });
      return entries.map((entry) => {
        entry.isMulti = entry.plans.length > 1;
        return entry;
      });
    }

    function getVisiblePlaneacionEntries() {
      return buildPlaneacionEntries(getVisiblePlaneaciones());
    }

    function getPlaneacionEntryByKey(entryKey) {
      return buildPlaneacionEntries(state.planeaciones || []).find((entry) => entry.key === entryKey) || null;
    }

    function getPlaneacionEntryByPlanId(planId) {
      const normalizedPlanId = String(planId || '').trim();
      if (!normalizedPlanId) return null;
      return buildPlaneacionEntries(state.planeaciones || [])
        .find((entry) => (entry.plans || []).some((plan) => String(plan.planeacion_id || '').trim() === normalizedPlanId)) || null;
    }

    function getOpenPlaneacionEntry(entry) {
      if (!entry) return null;
      const plans = Array.isArray(entry.plans) ? entry.plans : [];
      if (!plans.length) return null;
      const openPlanId = String(state.openPlanId || '').trim();
      if (openPlanId) {
        const matched = plans.find((plan) => String(plan.planeacion_id || '').trim() === openPlanId);
        if (matched) return matched;
      }
      if (entry.isMulti && state.ui && state.ui.multiGroupActiveChildByLote) {
        const preferredId = String(state.ui.multiGroupActiveChildByLote[entry.loteId] || '').trim();
        if (preferredId) {
          const preferred = plans.find((plan) => String(plan.planeacion_id || '').trim() === preferredId);
          if (preferred) return preferred;
        }
      }
      return plans[0];
    }

    function setMultiGroupActivePlan(loteId, planId) {
      if (!loteId || !state.ui || !state.ui.multiGroupActiveChildByLote) return;
      state.ui.multiGroupActiveChildByLote[loteId] = planId;
    }

    function isPlaneacionEntryOpen(entry) {
      if (!entry) return false;
      const openPlanId = String(state.openPlanId || '').trim();
      if (!openPlanId) return false;
      return (entry.plans || []).some((plan) => String(plan.planeacion_id || '').trim() === openPlanId);
    }

    function getPlaneacionEntryGroupLabels(entry) {
      return (entry && entry.plans || []).map((plan) => {
        const grupo = getGrupoById(plan.grupo_id);
        return grupo ? getGrupoDisplayName(grupo) : plan.grupo_id;
      });
    }

    function getPlaneacionEntryAlumnoCount(entry) {
      return (entry && entry.plans || []).reduce((sum, plan) => sum + getPlanAlumnoCount(plan), 0);
    }

    function getPlaneacionEntryActividadCount(entry) {
      const plan = entry && entry.representative;
      return getPlanActividadCount(plan);
    }

    function planEntryHasOpenMaterialAlert(entry) {
      return !!((entry && entry.plans || []).some((plan) => planHasOpenMaterialAlert(plan.planeacion_id)));
    }

    function getLatestResolvedMaterialAlertForEntry(entry) {
      const role = getCurrentRole();
      if (role !== 'admin' && role !== 'directora') return null;
      const alerts = (entry && entry.plans || [])
        .map((plan) => getLatestResolvedMaterialAlertForPlan(plan.planeacion_id))
        .filter(Boolean)
        .sort((a, b) => {
          const aDate = new Date(a.fecha_resolucion || a.fecha_actualizacion || a.fecha_creacion || 0).getTime();
          const bDate = new Date(b.fecha_resolucion || b.fecha_actualizacion || b.fecha_creacion || 0).getTime();
          return bDate - aDate;
        });
      return alerts[0] || null;
    }

    function buildMultiGroupSharedDraft(entry) {
      const selectedPlan = getOpenPlaneacionEntry(entry) || (entry && entry.representative) || null;
      if (!selectedPlan) return null;
      return {
        entryKey: entry.key,
        loteId: entry.loteId,
        basePlanId: selectedPlan.planeacion_id,
        fecha_planeacion: getWeekStartDateForPlan(selectedPlan),
        materia_id: selectedPlan.materia_id || '',
        submateria_id: selectedPlan.submateria_id || '',
        taller_id: selectedPlan.taller_id || '',
        frase_semana: selectedPlan.frase_semana || '',
        activities: (selectedPlan.actividades || []).length ? (selectedPlan.actividades || []).map((actividad) => ({
          key: actividad.actividad_id || uid('ACTSHR'),
          actividad_id: actividad.actividad_id || '',
          texto: actividad.texto || '',
          material_en_carpeta: normalizeMaterialStatus(actividad.material_en_carpeta),
          realizada: normalizeRealizadaStatus(actividad.realizada),
          comentario_cierre: actividad.comentario_cierre || ''
        })) : [{ key: uid('ACTSHR'), texto: '' }],
        plans: (entry.plans || []).map((plan) => ({
          planeacion_id: plan.planeacion_id,
          last_known_updated_at: plan.fecha_actualizacion || '',
          last_known_activities_version: plan.actividades_version_actual || ''
        }))
      };
    }

    function getMultiGroupSharedDraft(entry) {
      if (!entry || !entry.isMulti) return null;
      const existing = state.multiGroupSharedDrafts[entry.key];
      const selectedPlan = getOpenPlaneacionEntry(entry);
      if (!existing || !selectedPlan || existing.basePlanId !== selectedPlan.planeacion_id) {
        state.multiGroupSharedDrafts[entry.key] = buildMultiGroupSharedDraft(entry);
      }
      return state.multiGroupSharedDrafts[entry.key] || null;
    }

    function updateMultiGroupSharedField(entryKey, field, value, rerender) {
      const draft = state.multiGroupSharedDrafts[entryKey];
      if (!draft) return;
      draft[field] = value;
      if (field === 'materia_id') {
        const nextMateriaId = String(value || '').trim();
        const currentSubmateriaId = String(draft.submateria_id || '').trim();
        const hasMatchingSubmateria = currentSubmateriaId && getPlanSubmateriasForMateria(nextMateriaId).some((item) => String(item.submateria_id || '').trim() === currentSubmateriaId);
        draft.submateria_id = hasMatchingSubmateria ? currentSubmateriaId : '';
      }
      if (rerender) renderPlaneacionesList();
    }

    function updateMultiGroupSharedActivityField(entryKey, index, field, value) {
      const draft = state.multiGroupSharedDrafts[entryKey];
      if (!draft || !draft.activities[index]) return;
      draft.activities[index][field] = value;
    }

    function addMultiGroupSharedActivity(entryKey) {
      const draft = state.multiGroupSharedDrafts[entryKey];
      if (!draft) return;
      draft.activities.push({ key: uid('ACTSHR'), texto: '' });
      renderPlaneacionesList();
    }

    function removeMultiGroupSharedActivity(entryKey, index) {
      const draft = state.multiGroupSharedDrafts[entryKey];
      if (!draft || draft.activities.length <= 1) return;
      draft.activities.splice(index, 1);
      renderPlaneacionesList();
    }

    async function switchMultiGroupPlan(planId) {
      let plan = getPlanById(planId);
      if (!plan) return;
      plan = await ensurePlaneacionDetailLoaded(planId, { silent: true });
      const loteId = getPlanLoteId(plan);
      if (loteId) setMultiGroupActivePlan(loteId, planId);
      state.openPlanId = planId;
      state.openPlanDraft = buildOpenPlanDraft(plan);
      renderPlaneacionesList();
    }

    function normalizePlanAlumnosGrupoId(plan) {
      if (!plan || !Array.isArray(plan.alumnos) || !plan.alumnos.length) return plan;
      const planGrupoId = String(plan.grupo_id || '').trim();
      const nextAlumnos = plan.alumnos.map((alumno) => {
        if (!alumno || typeof alumno !== 'object') return alumno;
        const currentGrupoId = String(alumno.grupo_id || '').trim();
        if (currentGrupoId) return alumno;
        const inferredGrupoId = String(alumno.grupo_snapshot || '').trim() || planGrupoId;
        if (!inferredGrupoId) return alumno;
        return Object.assign({}, alumno, { grupo_id: inferredGrupoId });
      });
      plan.alumnos = nextAlumnos;
      return plan;
    }

    function isPreservedPlaneacionDetailStale(row, preservedPlan) {
      if (!row || !preservedPlan) return false;
      const rowUpdatedAtMs = Date.parse(String(row.fecha_actualizacion || ''));
      const preservedUpdatedAtMs = Date.parse(String(preservedPlan.fecha_actualizacion || ''));
      if (Number.isFinite(rowUpdatedAtMs) && Number.isFinite(preservedUpdatedAtMs) && rowUpdatedAtMs > preservedUpdatedAtMs + 1000) {
        return true;
      }
      const rowActivityVersion = String(row.actividades_version_actual || '').trim();
      const preservedActivityVersion = String(preservedPlan.actividades_version_actual || '').trim();
      return !!(rowActivityVersion && preservedActivityVersion && rowActivityVersion !== preservedActivityVersion);
    }

    function mergePreservedPlaneacionDetail(row, preservedPlan) {
      if (!row || !row.planeacion_id || !preservedPlan || !preservedPlan.detail_loaded) return row;
      const planId = String(row.planeacion_id || '').trim();
      if (!(hasUsableOpenPlanDetail(preservedPlan) && shouldKeepOpenPlanInlineDetail(planId, preservedPlan))) return row;
      if (isPreservedPlaneacionDetailStale(row, preservedPlan)) return row;
      const nextRow = Object.assign({}, row, {
        detail_loaded: true,
        boot_detail_loaded: true,
        alumnos: Array.isArray(preservedPlan.alumnos) ? preservedPlan.alumnos : [],
        actividades: Array.isArray(preservedPlan.actividades) ? preservedPlan.actividades : []
      });
      if (preservedPlan._draft_general_observation_text !== undefined) {
        nextRow._draft_general_observation_text = String(preservedPlan._draft_general_observation_text || '');
      }
      if (preservedPlan._draft_final_observations_by_key) {
        nextRow._draft_final_observations_by_key = Object.assign({}, preservedPlan._draft_final_observations_by_key || {});
      }
      if (preservedPlan.obs_loaded) {
        nextRow.obs_loaded = true;
        nextRow.obs_semana = Array.isArray(preservedPlan.obs_semana) ? preservedPlan.obs_semana : [];
        nextRow.obs_alumno_final = Array.isArray(preservedPlan.obs_alumno_final) ? preservedPlan.obs_alumno_final : [];
      }
      normalizePlanAlumnosGrupoId(nextRow);
      return nextRow;
    }

    function upsertPlaneacionRow(row) {
      if (!row || !row.planeacion_id) return null;
      const idx = state.planeaciones.findIndex((plan) => plan.planeacion_id === row.planeacion_id);
      if (idx === -1) {
        normalizePlanAlumnosGrupoId(row);
        state.planeaciones.unshift(row);
        return row;
      }
      const existing = state.planeaciones[idx] || {};
      let nextRow = Object.assign({}, existing, row);
      const existingUpdatedAtMs = Date.parse(String(existing.fecha_actualizacion || ''));
      const incomingUpdatedAtMs = Date.parse(String(row.fecha_actualizacion || ''));
      const incomingLooksOlder = Number.isFinite(existingUpdatedAtMs) &&
        Number.isFinite(incomingUpdatedAtMs) &&
        incomingUpdatedAtMs < existingUpdatedAtMs;
      if (incomingLooksOlder) {
        nextRow.estado = existing.estado || nextRow.estado;
        nextRow.fecha_actualizacion = existing.fecha_actualizacion || nextRow.fecha_actualizacion;
        nextRow.actividades_version_actual = existing.actividades_version_actual || nextRow.actividades_version_actual;
        nextRow.material_confirmado = existing.material_confirmado || nextRow.material_confirmado;
        if (existing.actividades_count !== undefined) {
          nextRow.actividades_count = existing.actividades_count;
        }
        if (existing.alumnos_count !== undefined) {
          nextRow.alumnos_count = existing.alumnos_count;
        }
        if (existing._local_save_state && !row._local_save_state) {
          nextRow._local_save_state = existing._local_save_state;
          nextRow._local_save_message = existing._local_save_message || nextRow._local_save_message || '';
        }
      }
      if (row.detail_loaded !== true && existing.detail_loaded) {
        nextRow = mergePreservedPlaneacionDetail(nextRow, existing);
      }
      if (incomingLooksOlder && existing.detail_loaded) {
        nextRow = mergePreservedPlaneacionDetail(nextRow, existing);
      }
      if (row.obs_loaded === false && existing.obs_loaded) {
        nextRow.obs_semana = Array.isArray(existing.obs_semana) ? existing.obs_semana : [];
        nextRow.obs_alumno_final = Array.isArray(existing.obs_alumno_final) ? existing.obs_alumno_final : [];
        nextRow.obs_loaded = true;
      }
      if (incomingLooksOlder && existing.obs_loaded) {
        nextRow.obs_semana = Array.isArray(existing.obs_semana) ? existing.obs_semana : [];
        nextRow.obs_alumno_final = Array.isArray(existing.obs_alumno_final) ? existing.obs_alumno_final : [];
        nextRow.obs_loaded = true;
      }
      normalizePlanAlumnosGrupoId(nextRow);
      state.planeaciones.splice(idx, 1, nextRow);
      return state.planeaciones[idx];
    }

    function upsertPlaneacionesRows(rows) {
      if (!Array.isArray(rows) || !rows.length) return [];
      return rows.map((row) => upsertPlaneacionRow(row)).filter(Boolean);
    }

    function preserveOpenPlanDetailOnRowsReplace(rows, planSnapshot = null, planId = state.openPlanId) {
      const normalizedPlanId = String(planId || '').trim();
      const nextRows = Array.isArray(rows) ? rows.slice() : [];
      if (!nextRows.length) return nextRows;
      const existingById = new Map((state.planeaciones || []).map((plan) => [String((plan && plan.planeacion_id) || '').trim(), plan]));
      return nextRows.map((row) => {
        const rowPlanId = String((row && row.planeacion_id) || '').trim();
        if (!rowPlanId) return row;
        const explicitSnapshot = normalizedPlanId && rowPlanId === normalizedPlanId
          ? (planSnapshot || getBootSnapshotOpenPlanById(rowPlanId))
          : null;
        const preservedPlan = explicitSnapshot || existingById.get(rowPlanId) || null;
        return mergePreservedPlaneacionDetail(row, preservedPlan);
      });
    }

    function removePlaneacionRows(planIds) {
      const ids = new Set((Array.isArray(planIds) ? planIds : [planIds]).map((item) => String(item || '').trim()).filter(Boolean));
      if (!ids.size) return;
      state.planeaciones = (state.planeaciones || []).filter((plan) => !ids.has(String((plan && plan.planeacion_id) || '').trim()));
      if (state.openPlanId && ids.has(String(state.openPlanId || '').trim())) {
        state.openPlanId = '';
        state.openPlanDraft = null;
      }
    }

    function cloneJsonSafe(value, fallback) {
      try {
        return JSON.parse(JSON.stringify(value));
      } catch (_) {
        return fallback;
      }
    }

    function buildPlanAlumnoSnapshotsByIds(alumnosIds, groupId, existingRows = []) {
      const existingMap = new Map((Array.isArray(existingRows) ? existingRows : []).map((row) => [String((row && row.alumno_id) || '').trim(), row]));
      return (Array.isArray(alumnosIds) ? alumnosIds : []).map((alumnoId) => {
        const normalizedId = String(alumnoId || '').trim();
        const existing = existingMap.get(normalizedId) || null;
        const alumno = getAlumnoById(normalizedId);
        return {
          alumno_id: normalizedId,
          grupo_snapshot: String((alumno && alumno.grupo_id) || (existing && existing.grupo_snapshot) || groupId || '').trim(),
          nombre_snapshot: String(
            (alumno && (alumno.nombre_mostrado || alumno.nombre_completo || alumno.alumno_id)) ||
            (existing && existing.nombre_snapshot) ||
            normalizedId
          ).trim()
        };
      });
    }

    function mergeOptimisticAlumnoFinalRows(plan, payloads) {
      const byAlumnoId = {};
      (Array.isArray(plan && plan.obs_alumno_final) ? plan.obs_alumno_final : []).forEach((row) => {
        byAlumnoId[String((row && row.alumno_id) || '').trim()] = Object.assign({}, row);
      });
      (Array.isArray(payloads) ? payloads : []).forEach((row) => {
        const alumnoId = String((row && row.alumnoId) || '').trim();
        if (!alumnoId) return;
        byAlumnoId[alumnoId] = Object.assign({}, byAlumnoId[alumnoId] || {}, {
          alumno_id: alumnoId,
          nota: String((row && row.nota) || '').trim(),
          fecha: getTodayYmdLocal(),
          fecha_creacion: new Date().toISOString()
        });
      });
      return Object.keys(byAlumnoId).map((alumnoId) => byAlumnoId[alumnoId]);
    }

    function mergeSavedObservationPreview(plan, generalText, finalPayloads, options = {}) {
      if (!plan || !plan.planeacion_id) return plan;
      const nextPlan = cloneJsonSafe(plan, Object.assign({}, plan)) || Object.assign({}, plan);
      const nowIso = new Date().toISOString();
      const trimmedGeneral = String(generalText || '').trim();
      if (trimmedGeneral) {
        const current = Array.isArray(nextPlan.obs_semana) ? nextPlan.obs_semana.slice() : [];
        current.push({
          obs_semana_id: uid('TMPOS'),
          planeacion_id: nextPlan.planeacion_id,
          fecha: getTodayYmdLocal(),
          fecha_creacion: nowIso,
          texto: trimmedGeneral,
          autor_id: getCurrentUserId()
        });
        nextPlan.obs_semana = current;
        nextPlan.obs_loaded = true;
      }
      if (trimmedGeneral) {
        nextPlan._draft_general_observation_text = options.clearGeneralDraft ? '' : trimmedGeneral;
      }
      if (Array.isArray(finalPayloads) && finalPayloads.length) {
        nextPlan.obs_alumno_final = mergeOptimisticAlumnoFinalRows(nextPlan, finalPayloads);
        const draftFinalMap = Object.assign({}, nextPlan._draft_final_observations_by_key || {});
        finalPayloads.forEach((row) => {
          const alumnoId = String((row && row.alumnoId) || '').trim();
          const targetPlanId = String((row && (row.planId || nextPlan.planeacion_id)) || '').trim();
          const nota = String((row && row.nota) || '').trim();
          if (!alumnoId) return;
          draftFinalMap[alumnoId] = nota;
          if (targetPlanId) draftFinalMap[targetPlanId + '::' + alumnoId] = nota;
        });
        nextPlan._draft_final_observations_by_key = draftFinalMap;
        nextPlan.obs_loaded = true;
      }
      return nextPlan;
    }

    function buildInlineSavedPlaneacionPreview(plan, optimisticPlan, updatedPlan, options = {}) {
      const basePlan = optimisticPlan || updatedPlan || plan;
      if (!basePlan || !basePlan.planeacion_id) return null;
      const nextPlan = cloneJsonSafe(basePlan, Object.assign({}, basePlan)) || Object.assign({}, basePlan);
      if (updatedPlan && typeof updatedPlan === 'object') {
        Object.keys(updatedPlan).forEach((key) => {
          if (key === 'actividades') return;
          if (
            key === 'alumnos' &&
            Array.isArray(updatedPlan.alumnos) &&
            updatedPlan.alumnos.length === 0 &&
            Array.isArray(nextPlan.alumnos) &&
            nextPlan.alumnos.length > 0
          ) {
            return;
          }
          if (updatedPlan[key] === undefined) return;
          nextPlan[key] = updatedPlan[key];
        });
      }
      if (Array.isArray(updatedPlan && updatedPlan.actividades) && updatedPlan.actividades.length) {
        const optimisticActivities = Array.isArray(optimisticPlan && optimisticPlan.actividades)
          ? optimisticPlan.actividades
          : [];
        const optimisticById = new Map(
          optimisticActivities
            .map((activity, index) => [String((activity && activity.actividad_id) || (activity && activity.orden) || index).trim(), activity])
        );
        nextPlan.actividades = updatedPlan.actividades.map((activity, index) => {
          const activityKey = String((activity && activity.actividad_id) || (activity && activity.orden) || index).trim();
          const optimisticActivity = optimisticById.get(activityKey) || optimisticActivities[index] || null;
          const sourceActivity = Array.isArray(plan && plan.actividades) ? plan.actividades[index] : null;
          const mergedActivity = Object.assign({}, optimisticActivity || {}, activity || {});
          if (optimisticActivity) {
            const previousText = String((sourceActivity && sourceActivity.texto) || '').trim();
            const optimisticText = String((optimisticActivity && optimisticActivity.texto) || '').trim();
            const responseText = String((activity && activity.texto) || '').trim();
            if (optimisticText && optimisticText !== previousText && responseText === previousText) {
              mergedActivity.texto = optimisticActivity.texto;
            }
          }
          if ((!String((activity && activity.realizada) || '').trim()) && optimisticActivity) {
            mergedActivity.realizada = optimisticActivity.realizada;
          }
          if ((!String((activity && activity.comentario_cierre) || '').trim()) && optimisticActivity) {
            mergedActivity.comentario_cierre = optimisticActivity.comentario_cierre;
          }
          if ((!String((activity && activity.material_en_carpeta) || '').trim()) && optimisticActivity) {
            mergedActivity.material_en_carpeta = optimisticActivity.material_en_carpeta;
          }
          if ((!String((activity && activity.texto) || '').trim()) && optimisticActivity) {
            mergedActivity.texto = optimisticActivity.texto;
          }
          return mergedActivity;
        });
      }
      nextPlan.detail_loaded = true;
      nextPlan.boot_detail_loaded = true;
      if (Array.isArray(nextPlan.actividades) && nextPlan.actividades.length) {
        const syncedAt = String(nextPlan.fecha_actualizacion || '').trim() || new Date().toISOString();
        nextPlan.actividades = nextPlan.actividades.map((activity, index) => {
          const sourceActivity = Array.isArray(plan && plan.actividades) ? plan.actividades[index] : null;
          const normalizedActivity = Object.assign({}, sourceActivity || {}, activity || {});
          normalizedActivity.fecha_actualizacion = String(normalizedActivity.fecha_actualizacion || '').trim() || syncedAt;
          return normalizedActivity;
        });
      }
      if (options.localState !== undefined) {
        nextPlan._local_save_state = String(options.localState || '').trim();
      }
      if (options.localMessage !== undefined) {
        nextPlan._local_save_message = String(options.localMessage || '').trim();
      }
      return nextPlan;
    }

    function buildOptimisticPlaneacionSavePreview(plan, options = {}) {
      if (!plan || !plan.planeacion_id) return null;
      const nextPlan = cloneJsonSafe(plan, Object.assign({}, plan)) || Object.assign({}, plan);
      const nowIso = new Date().toISOString();
      const draft = options.draft || null;
      const request = draft ? (options.request || buildOpenPlanSaveRequest(plan, draft)) : null;
      if (draft && request) {
        const fallbackWeekId = String((request.semana && request.semana.semana_id) || '').trim() || ('SEM_' + String(draft.fecha_planeacion || request.fallbackDate || '').replace(/-/g, ''));
        nextPlan.semana_id = request.semana && !request.semana.draft ? request.semana.semana_id : fallbackWeekId;
        nextPlan.materia_id = request.materiaId;
        nextPlan.submateria_id = request.submateriaId;
        nextPlan.taller_id = request.tallerId || '';
        nextPlan.frase_semana = String(draft.frase_semana || '').trim();
        nextPlan.alumnos = buildPlanAlumnoSnapshotsByIds(request.alumnosIds, plan.grupo_id, plan.alumnos);
        nextPlan.alumnos_count = nextPlan.alumnos.length;
        nextPlan.actividades = request.actividades.map((activity, index) => ({
          actividad_id: String((draft.activities && draft.activities[index] && draft.activities[index].actividad_id) || '').trim(),
          orden: index + 1,
          texto: String((activity && activity.texto) || '').trim(),
          material_en_carpeta: normalizeMaterialStatus((activity && activity.material_en_carpeta) || 'no_requiere'),
          realizada: normalizeRealizadaStatus((activity && activity.realizada) || ''),
          comentario_cierre: String((activity && activity.comentario_cierre) || '').trim(),
          fecha_actualizacion: nowIso
        }));
        nextPlan.actividades_count = nextPlan.actividades.length;
        nextPlan.detail_loaded = true;
        nextPlan.boot_detail_loaded = true;
        nextPlan.fecha_actualizacion = nowIso;
      }
      if (String(options.generalText || '').trim()) {
        const trimmedGeneral = String(options.generalText || '').trim();
        const current = Array.isArray(nextPlan.obs_semana) ? nextPlan.obs_semana.slice() : [];
        current.push({
          obs_semana_id: uid('TMPOS'),
          planeacion_id: plan.planeacion_id,
          fecha: getTodayYmdLocal(),
          fecha_creacion: nowIso,
          texto: trimmedGeneral,
          autor_id: getCurrentUserId()
        });
        nextPlan.obs_semana = current;
        nextPlan.obs_loaded = true;
        nextPlan._draft_general_observation_text = options.clearGeneralDraft ? '' : trimmedGeneral;
      }
      if (Array.isArray(options.finalPayloads) && options.finalPayloads.length) {
        nextPlan.obs_alumno_final = mergeOptimisticAlumnoFinalRows(nextPlan, options.finalPayloads);
        const draftFinalMap = Object.assign({}, nextPlan._draft_final_observations_by_key || {});
        options.finalPayloads.forEach((row) => {
          const alumnoId = String((row && row.alumnoId) || '').trim();
          const targetPlanId = String((row && (row.planId || nextPlan.planeacion_id)) || '').trim();
          const nota = String((row && row.nota) || '').trim();
          if (!alumnoId) return;
          draftFinalMap[alumnoId] = nota;
          if (targetPlanId) draftFinalMap[targetPlanId + '::' + alumnoId] = nota;
        });
        nextPlan._draft_final_observations_by_key = draftFinalMap;
        nextPlan.obs_loaded = true;
      }
      nextPlan._local_save_state = String(options.localState || 'saving').trim();
      nextPlan._local_save_message = options.localMessage !== undefined
        ? String(options.localMessage || '').trim()
        : 'Guardando cambios...';
      return nextPlan;
    }

    function buildOptimisticCreatedPlaneaciones(options = {}) {
      const groupIds = Array.isArray(options.groupIds) ? options.groupIds.map((item) => String(item || '').trim()).filter(Boolean) : [];
      if (!groupIds.length) return [];
      const nowIso = new Date().toISOString();
      const materiaId = String(options.materiaId || '').trim();
      const submateriaId = String(options.submateriaId || '').trim();
      const tallerId = String(options.tallerId || '').trim();
      const semanaId = String((options.semana && options.semana.semana_id) || '').trim() || ('SEM_' + String(options.fechaPlaneacion || '').replace(/-/g, ''));
      const loteId = groupIds.length > 1 ? uid('TMPLTE') : '';
      const materiaRow = (state.catalogos.materias || []).find((item) => String(item.materia_id || '').trim() === materiaId) || null;
      const submateriaRow = getSubmateriaById(submateriaId);
      const facilitadorId = String((state.session && state.session.usuario && state.session.usuario.facilitador_id) || '').trim();
      return groupIds.map((groupId) => {
        const alumnosIds = (Array.isArray(options.alumnosIds) ? options.alumnosIds : []).filter((alumnoId) => {
          const alumno = getAlumnoById(alumnoId);
          return !alumno || String(alumno.grupo_id || '').trim() === groupId;
        });
        return {
          planeacion_id: uid('TMPPLA'),
          planeacion_lote_id: loteId,
          semana_id: semanaId,
          fecha_planeacion: String(options.fechaPlaneacion || '').trim(),
          facilitador_id: facilitadorId,
          grupo_id: groupId,
          materia_id: materiaId,
          submateria_id: submateriaId,
          taller_id: tallerId,
          materia_nombre: materiaRow ? (materiaRow.nombre || materiaId) : materiaId,
          submateria_nombre: tallerId ? ((getTallerById(tallerId) || {}).nombre || tallerId) : (submateriaRow ? (submateriaRow.nombre || submateriaId) : ''),
          frase_semana: String(options.fraseSemana || '').trim(),
          estado: String(options.targetStatus || 'borrador').trim() || 'borrador',
          fecha_creacion: nowIso,
          fecha_actualizacion: nowIso,
          actividades_version_actual: '',
          actividades_count: Array.isArray(options.activities) ? options.activities.length : 0,
          alumnos_count: alumnosIds.length,
          alumnos: buildPlanAlumnoSnapshotsByIds(alumnosIds, groupId),
          actividades: (Array.isArray(options.activities) ? options.activities : []).map((activity, index) => ({
            actividad_id: '',
            orden: index + 1,
            texto: String((activity && activity.texto) || '').trim(),
            material_en_carpeta: normalizeMaterialStatus((activity && activity.material_en_carpeta) || 'no_requiere'),
            realizada: normalizeRealizadaStatus((activity && activity.realizada) || ''),
            comentario_cierre: String((activity && activity.comentario_cierre) || '').trim(),
            fecha_actualizacion: nowIso
          })),
          detail_loaded: false,
          boot_detail_loaded: true,
          obs_loaded: false,
          _local_save_state: 'creating',
          _local_save_message: 'Sincronizando planeación...'
        };
      });
    }

    function applyLocalPlaneacionFeedback(planIds, stateName, message) {
      (Array.isArray(planIds) ? planIds : [planIds]).forEach((planId) => {
        const normalizedId = String(planId || '').trim();
        if (!normalizedId) return;
        const current = getPlanById(normalizedId);
        if (!current) return;
        upsertPlaneacionRow({
          planeacion_id: normalizedId,
          _local_save_state: String(stateName || '').trim(),
          _local_save_message: String(message || '').trim()
        });
      });
    }

    function scheduleClearLocalPlaneacionFeedback(planIds, delay = 1400) {
      const ids = (Array.isArray(planIds) ? planIds : [planIds]).map((planId) => String(planId || '').trim()).filter(Boolean);
      if (!ids.length) return;
      scheduleUiDebounce('plan-feedback-clear:' + ids.join(','), () => {
        ids.forEach((planId) => {
          const current = getPlanById(planId);
          if (!current) return;
          upsertPlaneacionRow({
            planeacion_id: planId,
            _local_save_state: '',
            _local_save_message: ''
          });
        });
        if (isPlaneacionesSurfaceVisible()) renderPlaneacionesList();
      }, delay);
    }

    function capturePlanEditorSnapshot() {
      const materiaId = String(($('planMateria') && $('planMateria').value) || '').trim();
      return {
        planEditor: cloneJsonSafe(state.planEditor, state.planEditor) || state.planEditor,
        fechaPlaneacion: String(($('planFecha') && $('planFecha').value) || '').trim(),
        materiaId,
        selectedSubmateriaId: getPlanEditorSelectedSubmateriaId(materiaId),
        selectedTallerId: getSelectedPlanTallerId(),
        fraseSemana: String(($('planFrase') && $('planFrase').value) || '').trim(),
        selectedGroupIds: getSelectedGroupIds(),
        selectedAlumnoIds: getSelectedPlanAlumnos()
      };
    }

    function restorePlanEditorFromSnapshot(snapshot) {
      if (!snapshot) return;
      const editorState = snapshot.planEditor && typeof snapshot.planEditor === 'object'
        ? snapshot.planEditor
        : snapshot;
      const materiaId = String((snapshot.materiaId || snapshot.materia_id || '').trim ? (snapshot.materiaId || snapshot.materia_id || '').trim() : (snapshot.materiaId || snapshot.materia_id || ''));
      const selectedSubmateriaId = String((snapshot.selectedSubmateriaId || snapshot.selected_submateria_id || '').trim ? (snapshot.selectedSubmateriaId || snapshot.selected_submateria_id || '').trim() : (snapshot.selectedSubmateriaId || snapshot.selected_submateria_id || ''));
      const selectedTallerId = String((snapshot.selectedTallerId || snapshot.selected_taller_id || '').trim ? (snapshot.selectedTallerId || snapshot.selected_taller_id || '').trim() : (snapshot.selectedTallerId || snapshot.selected_taller_id || ''));
      const selectedGroupIds = new Set((Array.isArray(snapshot.selectedGroupIds) ? snapshot.selectedGroupIds : []).map((groupId) => String(groupId || '').trim()).filter(Boolean));
      const selectedAlumnoIds = new Set((Array.isArray(snapshot.selectedAlumnoIds) ? snapshot.selectedAlumnoIds : []).map((alumnoId) => String(alumnoId || '').trim()).filter(Boolean));
      state.planEditor = cloneJsonSafe(editorState, editorState) || editorState;
      if (selectedSubmateriaId) state.planEditor.selectedSubmateriaId = selectedSubmateriaId;
      state.planEditor.selectedTallerId = selectedTallerId || '';
      if (state.ui) state.ui.planBuilderExpanded = true;
      renderPlanEditor();
      if ($('planFecha')) $('planFecha').value = String(snapshot.fechaPlaneacion || snapshot.fecha_planeacion || '').trim();
      if ($('planMateria')) $('planMateria').value = materiaId;
      syncPlanSubmateriaSelect(selectedSubmateriaId);
      if ($('planFrase')) $('planFrase').value = String(snapshot.fraseSemana || snapshot.frase_semana || '').trim();
      if ($('planSubmateria')) {
        if (getPlanEditorUsesTallerSelector(materiaId)) {
          $('planSubmateria').value = selectedTallerId || '';
          handlePlanTallerChanged();
        } else {
          $('planSubmateria').value = selectedSubmateriaId || '';
        }
      }
      Array.from($('planGruposChecklist').querySelectorAll('input[type="checkbox"]')).forEach((input) => {
        input.checked = selectedGroupIds.has(String(input.value || '').trim());
      });
      renderPlanAlumnosChecklist(selectedAlumnoIds);
      renderPlanBuilderVisibility();
    }

    function rollbackFailedPlaneacionOutboxCreate(item) {
      if (!item || typeof item !== 'object') return;
      if (Array.isArray(item.tempPlanIds) && item.tempPlanIds.length) {
        removePlaneacionRows(item.tempPlanIds);
      }
      state.openPlanId = '';
      state.openPlanDraft = null;
      restorePlanEditorFromSnapshot(item.planEditorSnapshot || null);
      persistCurrentBootSnapshot('planeacion_outbox_create_failed');
      renderPlaneacionesSurface({
        includeStats: true,
        includePlaneaciones: true,
        includeAlertas: false
      });
    }

    function restorePendingPlanObservationInputs(planId, generalText, finalPayloads) {
      const normalizedPlanId = String(planId || '').trim();
      if (!normalizedPlanId) return;
      window.requestAnimationFrame(() => {
        const generalInput = $('obs-general-' + normalizedPlanId);
        if (generalInput) generalInput.value = String(generalText || '').trim();
        (Array.isArray(finalPayloads) ? finalPayloads : []).forEach((row) => {
          const alumnoId = String((row && row.alumnoId) || '').trim();
          const targetPlanId = String((row && row.planId) || normalizedPlanId).trim();
          if (!alumnoId) return;
          const input = $('obs-final-' + targetPlanId + '-' + alumnoId);
          if (input) {
            input.value = String((row && row.nota) || '').trim();
            autoGrowObsFinal(input);
          }
        });
      });
    }

    function restoreOpenPlanDraftAfterSaveRefresh(planId, draft, generalText, finalPayloads) {
      const normalizedPlanId = String(planId || '').trim();
      if (!normalizedPlanId || String(state.openPlanId || '').trim() !== normalizedPlanId) return false;
      const currentPlan = getPlanById(normalizedPlanId);
      const sourceDraft = draft
        ? (cloneJsonSafe(draft, draft) || draft)
        : (currentPlan && currentPlan.detail_loaded ? buildOpenPlanDraft(currentPlan) : null);
      if (!sourceDraft) return false;
      sourceDraft.planId = normalizedPlanId;
      state.openPlanDraft = syncOpenPlanDraftConcurrencyHints(
        currentPlan || {},
        buildOpenPlanDraftWithPendingObservations(sourceDraft, generalText, finalPayloads)
      );
      renderPlaneacionesList();
      restorePendingPlanObservationInputs(normalizedPlanId, generalText, finalPayloads);
      return true;
    }

    function updateOpenPlanGeneralObservationDraft(planId, value) {
      if (!state.openPlanDraft) return;
      const normalizedPlanId = String(planId || state.openPlanDraft.planId || '').trim();
      if (!normalizedPlanId) return;
      if (String(state.openPlanDraft.planId || '').trim() !== normalizedPlanId) return;
      state.openPlanDraft.generalObservationText = String(value || '');
      state.openPlanDraft.generalObservationDirty = true;
      const currentPlan = getPlanById(normalizedPlanId);
      if (currentPlan && currentPlan.planeacion_id) {
        upsertPlaneacionRow({
          planeacion_id: normalizedPlanId,
          _draft_general_observation_text: state.openPlanDraft.generalObservationText
        });
      }
      persistOpenPlanSnapshotSoon('planeacion_draft_obs_general');
    }

    function queuePlaneacionPostSaveSync(planId, options = {}) {
      const normalizedPlanId = String(planId || '').trim();
      if (!normalizedPlanId) return;
      const delay = Number(options.delay || 520);
      scheduleUiDebounce('plan-post-save-sync:' + normalizedPlanId, async () => {
        try {
          if (options.refreshDetail !== false) {
            await refreshSinglePlaneacionSurface(normalizedPlanId, {
              includeAlertas: false,
              snapshotKind: options.snapshotKind || 'planeacion_post_save_sync'
            });
          }
        } catch (_) {}
        if (options.refreshObservaciones) {
          try {
            await ensurePlaneacionObservacionesLoaded(normalizedPlanId, { silent: true, force: true });
            renderPlaneacionesList();
          } catch (_) {}
        }
        if (options.refreshAlertas) {
          refreshPlaneacionesAlertsDeferred({
            force: true,
            includeStats: false,
            includePlaneaciones: false,
            delay: 120
          }).catch(() => {});
        }
      }, delay);
    }

    function appendPlaneacionesRows(rows) {
      if (!Array.isArray(rows) || !rows.length) return;
      const existingById = new Map((state.planeaciones || []).map((plan) => [plan.planeacion_id, plan]));
      const nextRows = [...(state.planeaciones || [])];
      rows.forEach((row) => {
        if (!row || !row.planeacion_id) return;
        const existing = existingById.get(row.planeacion_id);
        if (existing) {
          const existingIndex = nextRows.findIndex((plan) => plan.planeacion_id === row.planeacion_id);
          if (existingIndex >= 0) nextRows.splice(existingIndex, 1, Object.assign({}, existing, row));
          return;
        }
        nextRows.push(row);
        existingById.set(row.planeacion_id, row);
      });
      state.planeaciones = nextRows;
    }

    async function fetchPlaneacionDetalle(planId, options = {}) {
      const bypassDetailCache = options && options.bypassDetailCache === true;
      let primaryPlan = null;
      if (!bypassDetailCache) {
        try {
          const data = await api('getPlaneacionDetalle', { planeacion_id: planId, include_observaciones: false });
          if (data && data.planeacion) {
            primaryPlan = data.planeacion;
            if (primaryPlan.detail_loaded) return primaryPlan;
          }
        } catch (err) {
          if (!err || err.code !== 'NOT_FOUND') throw err;
        }
      }
      const fallback = await api('getPlaneaciones', {
        planeacion_id: planId,
        include_detail: true,
        limit: 1
      });
      const rows = Array.isArray(fallback && fallback.rows) ? fallback.rows : [];
      if (!rows.length) {
        if (primaryPlan) {
          return Object.assign({}, primaryPlan, {
            detail_loaded: true
          });
        }
        throw new Error('Planeaci\u00f3n no encontrada.');
      }
      return Object.assign({}, rows[0], {
        detail_loaded: true
      });
    }

    async function fetchPlaneacionListRow(planId) {
      const normalizedPlanId = String(planId || '').trim();
      if (!normalizedPlanId) return null;
      const data = await api('getPlaneaciones', {
        planeacion_id: normalizedPlanId,
        include_detail: false,
        limit: 1
      });
      const rows = Array.isArray(data && data.rows) ? data.rows : [];
      return rows[0] || null;
    }

    async function fetchPlaneacionObservaciones(planId) {
      const data = await api('getPlaneacionObservaciones', { planeacion_id: planId });
      return {
        planeacion_id: planId,
        obs_semana: Array.isArray(data && data.obs_semana) ? data.obs_semana : [],
        obs_alumno_final: Array.isArray(data && data.obs_alumno_final) ? data.obs_alumno_final : [],
        obs_loaded: true
      };
    }

    async function ensurePlaneacionDetailLoaded(planId, options = {}) {
      const current = getPlanById(planId);
      const hasUsableCurrentDetail = current && current.detail_loaded && (
        (Number(current.alumnos_count || 0) === 0 || (Array.isArray(current.alumnos) && current.alumnos.length > 0)) &&
        (Number(current.actividades_count || 0) === 0 || (Array.isArray(current.actividades) && current.actividades.length > 0))
      );
      if (hasUsableCurrentDetail && !options.force) return current;
      if (!state.ui.planDetailPromises) state.ui.planDetailPromises = {};
      if (!options.force && state.ui.planDetailPromises[planId]) {
        return state.ui.planDetailPromises[planId];
      }
      if (options.force && state.ui.planDetailPromises[planId]) {
        delete state.ui.planDetailPromises[planId];
      }
      const promise = fetchPlaneacionDetalle(planId, {
        bypassDetailCache: options.force === true
      })
        .then((detail) => {
          const updated = upsertPlaneacionRow(detail);
          if (state.openPlanId === planId && hasUsableOpenPlanDetail(updated)) {
            state.openPlanDraft = updated
              ? preserveOpenPlanDraftLocalEdits(planId, buildOpenPlanDraft(updated), updated)
              : null;
          }
          markPlaneacionDetailFresh(planId);
          return updated;
        })
        .finally(() => {
          if (state.ui && state.ui.planDetailPromises) {
            delete state.ui.planDetailPromises[planId];
          }
        });
      state.ui.planDetailPromises[planId] = promise;
      return promise;
    }

    async function ensurePlaneacionObservacionesLoaded(planId, options = {}) {
      const current = getPlanById(planId);
      if (!current || !current.detail_loaded) return current;
      if (current.obs_loaded) return current;
      if (!options.force && getPlanLocalSaveState(current) === 'saving') return current;
      if (!options.force) {
        const snapshotObs = getSnapshotOpenPlanObservaciones(planId);
        if (snapshotObs) {
          const updatedFromSnapshot = upsertPlaneacionRow(snapshotObs);
          markPlaneacionObservacionesFresh(planId);
          if (!options.silent) renderPlaneacionesList();
          return updatedFromSnapshot;
        }
      }
      if (!state.ui.planObservacionesPromises) state.ui.planObservacionesPromises = {};
      if (state.ui.planObservacionesPromises[planId]) {
        return state.ui.planObservacionesPromises[planId];
      }
      const promise = fetchPlaneacionObservaciones(planId)
        .then((payload) => {
          const updated = upsertPlaneacionRow(payload);
          markPlaneacionObservacionesFresh(planId);
          if (!options.silent) renderPlaneacionesList();
          persistCurrentBootSnapshot('planeacion_obs_hidratadas');
          return updated;
        })
        .finally(() => {
          if (state.ui && state.ui.planObservacionesPromises) {
            delete state.ui.planObservacionesPromises[planId];
          }
        });
      state.ui.planObservacionesPromises[planId] = promise;
      return promise;
    }

    async function ensurePlaneacionEntryDetailsLoaded(entry, options = {}) {
      if (!entry || !entry.isMulti) return entry;
      const missingPlanIds = (entry.plans || [])
        .filter((plan) => !plan.detail_loaded)
        .map((plan) => plan.planeacion_id);
      if (!missingPlanIds.length) return entry;
      const concurrency = 2;
      for (let index = 0; index < missingPlanIds.length; index += concurrency) {
        const batch = missingPlanIds.slice(index, index + concurrency);
        await Promise.all(batch.map((siblingPlanId) => ensurePlaneacionDetailLoaded(siblingPlanId, { silent: true })));
      }
      const refreshedEntry = getPlaneacionEntryByKey(entry.key) || entry;
      if (!options.silent) renderPlaneacionesList();
      return refreshedEntry;
    }

    function getUnconfiguredWeekMessage() {
      return 'Esta semana no está configurada. Elige una fecha dentro de una semana disponible o pide a admin agregarla.';
    }

    function getNewWeekDraftMessage(week) {
      return formatSemanaLabel(week);
    }

    function getPlanEditorResolvedWeekState() {
      const fallbackDate = state.planEditor.mode === 'edit'
        ? getWeekStartDateById(state.planEditor.lockedSemanaId)
        : '';
      const resolvedDate = String((($('planFecha') && $('planFecha').value) || fallbackDate) || '').trim();
      const lockedPlanWeek = state.planEditor.mode === 'edit'
        ? getWeekByIdOrInferred(state.planEditor.lockedSemanaId)
        : null;
      return {
        resolvedDate,
        week: lockedPlanWeek && semanaContainsDate(lockedPlanWeek, resolvedDate)
          ? lockedPlanWeek
          : getPlanEditorWeekByDateOrDraft(resolvedDate)
      };
    }

    function isPlanEditorWeekUnavailable() {
      const resolved = getPlanEditorResolvedWeekState();
      return !!(resolved.resolvedDate && resolved.week && resolved.week.draft);
    }

    function syncPlanEditorActionAvailability(catalogsLoadingOverride) {
      const catalogsLoading = catalogsLoadingOverride !== undefined
        ? !!catalogsLoadingOverride
        : !!(state.ui && state.ui.planeacionesCatalogosLoading) && currentViewNeedsCatalogos();
      const disabled = catalogsLoading;
      const disabledTitle = '';
      [$('savePlanBtn'), $('savePlanDraftBtn'), $('savePlanActiveBtn')].forEach((button) => {
        if (!button) return;
        button.disabled = disabled;
        if (disabledTitle) button.title = disabledTitle;
        else button.removeAttribute('title');
      });
    }

    function syncPlanEditorWeekValidation() {
      const errors = getPlanEditorValidationErrors();
      if (errors.planFecha === getUnconfiguredWeekMessage()) {
        delete errors.planFecha;
      }
      renderPlanEditorValidation();
    }

    function renderPlanWeekResolved() {
      const host = $('planSemanaResolved');
      const resolved = getPlanEditorResolvedWeekState();
      const week = resolved.week;
      const hint = week ? getSemanaHintText(week) : '';
      host.textContent = week
        ? (week.draft
          ? getNewWeekDraftMessage(week)
          : [formatSemanaLabel(week), hint].filter(Boolean).join(' \u00b7 '))
        : 'Selecciona una fecha.';
      host.className = 'inline-note';
      if (week) host.classList.add(week.draft ? 'is-open' : (String(week.cerrada_global || '').toLowerCase() === 'si' ? 'is-closed' : 'is-open'));
    }

    function handlePlanFechaChanged(event) {
      const input = event && event.currentTarget ? event.currentTarget : $('planFecha');
      if (!input) return;
      if ($('planFecha') && $('planFecha') !== input) $('planFecha').value = input.value || '';
      clearPlanEditorValidation('planFecha');
      renderPlanWeekResolved();
      syncPlanEditorWeekValidation();
      syncPlanEditorActionAvailability();
    }

    function renderPlanGroupChecklist() {
      const host = $('planGruposChecklist');
      const catalogsLoading = !!(state.ui && state.ui.planeacionesCatalogosLoading) && currentViewNeedsCatalogos();
      if (catalogsLoading) {
        host.classList.remove('is-taller-groups');
        host.innerHTML = '<div class="empty">Cargando grupos...</div>';
        return;
      }
      const selectedTallerId = getSelectedPlanTallerId();
      if (selectedTallerId && state.planEditor.mode !== 'edit') {
        const groupIds = getPlanTallerAvailableGroupIds(selectedTallerId);
        host.classList.add('is-taller-groups');
        host.innerHTML = groupIds.length
          ? groupIds.map((groupId) => {
              const group = getCatalogIndex().gruposById.get(String(groupId || '').trim());
              const label = group ? getGrupoDisplayName(group) : groupId;
              return (
                '<label class="check-item is-auto-selected">' +
                  '<input type="checkbox" value="' + escapeHtml(groupId) + '" checked>' +
                  '<span><strong>' + escapeHtml(label) + '</strong></span>' +
                '</label>'
              );
            }).join('')
          : '<div class="empty">Este taller todav&iacute;a no tiene alumnos activos.</div>';
        return;
      }
      host.classList.remove('is-taller-groups');
      const editLocked = state.planEditor.mode === 'edit' && !canUseAdminShell();
      const currentSelectedGroups = getSelectedGroupIds();
      const checkedSet = new Set(
        state.planEditor.mode === 'edit'
          ? (currentSelectedGroups.length ? currentSelectedGroups : [state.planEditor.lockedGrupoId])
          : currentSelectedGroups
      );
      const groups = [...state.catalogos.grupos].sort((a, b) => getGrupoDisplayName(a).localeCompare(getGrupoDisplayName(b), 'es'));
      host.innerHTML = groups.map((group) => {
        const disabled = editLocked && group.grupo_id !== state.planEditor.lockedGrupoId;
        const checked = editLocked ? group.grupo_id === state.planEditor.lockedGrupoId : checkedSet.has(group.grupo_id);
        return (
          '<label class="check-item">' +
            '<input type="checkbox" value="' + escapeHtml(group.grupo_id) + '"' + (checked ? ' checked' : '') + (disabled ? ' disabled' : '') + '>' +
            '<span><strong>' + escapeHtml(getGrupoDisplayName(group)) + '</strong></span>' +
          '</label>'
        );
      }).join('');
      window.requestAnimationFrame(() => {
        document.querySelectorAll('.obs-final-input').forEach((textarea) => autoGrowObsFinal(textarea));
        if (state.openPlanDraft && state.openPlanDraft.planId) {
          const generalInput = $('obs-general-' + state.openPlanDraft.planId);
          if (generalInput && generalInput.value !== String(state.openPlanDraft.generalObservationText || '')) {
            generalInput.value = String(state.openPlanDraft.generalObservationText || '');
          }
        }
      });
    }

    function getAlumnosByGroupId(groupId) {
      return getCatalogIndex().alumnosByGroupId.get(String(groupId || '').trim()) || [];
    }

    function getPlanEditorTallerOptions() {
      const currentUserId = getCurrentUserId();
      return (state.catalogos.talleres || [])
        .filter((row) => {
          const status = String(row.estatus || '').trim() || (row.activo === false ? 'inactivo' : 'activo');
          if (status !== 'activo' || row.activo === false) return false;
          if (canUseAdminShell()) return true;
          const facilitatorId = String(row.facilitador_id || '').trim();
          return !!facilitatorId && !!currentUserId && facilitatorId === currentUserId;
        })
        .sort((a, b) => String(a.nombre || a.taller_id).localeCompare(String(b.nombre || b.taller_id), 'es'));
    }

    function getSelectedPlanTallerId() {
      return String(state.planEditor && state.planEditor.selectedTallerId || '').trim();
    }

    function getPlanTallerAlumnoIdSet(tallerId) {
      const targetId = String(tallerId || '').trim();
      if (!targetId) return new Set();
      return new Set((state.catalogos.alumno_talleres || [])
        .filter((row) => String(row.taller_id || '').trim() === targetId && row.activa !== false)
        .map((row) => String(row.alumno_id || '').trim())
        .filter(Boolean));
    }

    function getPlanEditorAlumnosByGroupId(groupId) {
      const alumnos = getAlumnosByGroupId(groupId);
      const tallerId = getSelectedPlanTallerId();
      if (!tallerId) return alumnos;
      const allowedAlumnoIds = getPlanTallerAlumnoIdSet(tallerId);
      if (!allowedAlumnoIds.size) return [];
      return alumnos.filter((alumno) => allowedAlumnoIds.has(String(alumno.alumno_id || '').trim()));
    }

    function isPlanEditorAlumnoSelectable(alumno) {
      return getAlumnoStatusVisual(alumno) === 'activo';
    }

    function getPlanTallerAvailableGroupIds(tallerId) {
      const allowedAlumnoIds = getPlanTallerAlumnoIdSet(tallerId);
      if (!allowedAlumnoIds.size) return [];
      const groupIds = new Set();
      allowedAlumnoIds.forEach((alumnoId) => {
        const alumno = getCatalogIndex().alumnosById.get(alumnoId);
        const groupId = String(alumno && alumno.grupo_id || '').trim();
        if (groupId) groupIds.add(groupId);
      });
      return Array.from(groupIds);
    }

    function getAlumnoDisplaySnapshot(alumnoRow) {
      const alumnoId = String(alumnoRow && alumnoRow.alumno_id || '').trim();
      const catalogAlumno = getCatalogIndex().alumnosById.get(alumnoId);
      return {
        nombre: catalogAlumno
          ? getAlumnoNameLabel(catalogAlumno)
          : (alumnoRow && alumnoRow.nombre_snapshot || formatAlumnoCompactId(alumnoId))
      };
    }

    function applyGroupSelectionToAlumnoSet(selectedSet, groupId, checked) {
      const nextSelected = selectedSet instanceof Set ? selectedSet : new Set(selectedSet || []);
      getPlanEditorAlumnosByGroupId(groupId).forEach((alumno) => {
        if (!isPlanEditorAlumnoSelectable(alumno)) {
          nextSelected.delete(alumno.alumno_id);
          return;
        }
        if (checked) nextSelected.add(alumno.alumno_id);
        else nextSelected.delete(alumno.alumno_id);
      });
      return nextSelected;
    }

    function renderPlanAlumnosChecklist(selectedOverride) {
      const host = $('planAlumnosChecklist');
      const catalogsLoading = !!(state.ui && state.ui.planeacionesCatalogosLoading) && currentViewNeedsCatalogos();
      if (host) {
        host.classList.remove('is-multigroup-alumnos', 'is-taller-alumnos-list');
      }
      if (catalogsLoading) {
        host.innerHTML = '<div class="empty">Cargando grupos y alumnos...</div>';
        return;
      }
      const selected = selectedOverride instanceof Set ? new Set(selectedOverride) : new Set(getSelectedPlanAlumnos());
      const selectedGroups = getSelectedGroupIds();
      const groupIds = state.planEditor.mode === 'edit'
        ? ((canUseAdminShell() ? selectedGroups : []).length ? selectedGroups : [state.planEditor.lockedGrupoId])
        : selectedGroups;
      if (!groupIds.length) {
        host.innerHTML = '<div class="empty">' + (getSelectedPlanTallerId() ? 'Selecciona un taller con alumnos disponibles o marca un grupo.' : 'Selecciona al menos un grupo para cargar alumnos.') + '</div>';
        return;
      }
      const selectedTallerId = getSelectedPlanTallerId();
      if (selectedTallerId) {
        host.classList.add('is-taller-alumnos-list');
        const seenAlumnoIds = new Set();
        const alumnos = [];
        groupIds.forEach((groupId) => {
          getPlanEditorAlumnosByGroupId(groupId).forEach((alumno) => {
            const alumnoId = String(alumno.alumno_id || '').trim();
            if (!alumnoId || seenAlumnoIds.has(alumnoId)) return;
            seenAlumnoIds.add(alumnoId);
            alumnos.push(alumno);
          });
        });
        const selectedCount = alumnos.filter((alumno) => selected.has(String(alumno.alumno_id || '').trim())).length;
        host.innerHTML = '<div class="group-block is-taller-alumnos">' +
          '<div class="group-block-head">' +
            '<div><strong>Alumnos del taller</strong><span class="mini">' + escapeHtml(String(selectedCount)) + ' de ' + escapeHtml(String(alumnos.length)) + ' seleccionado(s)</span></div>' +
          '</div>' +
          '<div class="checklist plan-alumnos-flat">' +
            (alumnos.length ? alumnos.map((alumno) => {
              const alumnoId = String(alumno.alumno_id || '').trim();
              const label = getAlumnoNameLabel(alumno);
              const group = getCatalogIndex().gruposById.get(String(alumno.grupo_id || '').trim());
              const groupLabel = group ? getGrupoDisplayName(group) : String(alumno.grupo_id || '').trim();
              const selectable = isPlanEditorAlumnoSelectable(alumno);
              return (
                '<label class="check-item">' +
                  '<input type="checkbox" data-group-id="' + escapeHtml(alumno.grupo_id || '') + '" value="' + escapeHtml(alumnoId) + '"' + (selected.has(alumnoId) && selectable ? ' checked' : '') + (selectable ? '' : ' disabled') + '>' +
                  '<span><strong>' + escapeHtml(label) + '</strong>' + (groupLabel ? '<span class="mini">' + escapeHtml(groupLabel) + '</span>' : '') + (selectable ? '' : '<span class="mini">No activo</span>') + '</span>' +
                '</label>'
              );
            }).join('') : '<div class="empty">No hay alumnos activos en este taller para tus grupos.</div>') +
          '</div>' +
        '</div>';
        return;
      }
      if (groupIds.length > 1) {
        host.classList.add('is-multigroup-alumnos');
        const alumnos = [];
        const seenAlumnoIds = new Set();
        groupIds.forEach((groupId) => {
          getPlanEditorAlumnosByGroupId(groupId).forEach((alumno) => {
            const alumnoId = String(alumno.alumno_id || '').trim();
            if (!alumnoId || seenAlumnoIds.has(alumnoId)) return;
            seenAlumnoIds.add(alumnoId);
            alumnos.push(Object.assign({}, alumno, { _builder_group_id: groupId }));
          });
        });
        const selectedCount = alumnos.filter((alumno) => selected.has(String(alumno.alumno_id || '').trim())).length;
        host.innerHTML = '<div class="group-block is-multigroup-alumnos-flat">' +
          '<div class="group-block-head">' +
            '<div><strong>Alumnos</strong> <span class="mini">' + escapeHtml(String(selectedCount)) + ' de ' + escapeHtml(String(alumnos.length)) + ' seleccionado(s)</span></div>' +
          '</div>' +
          '<div class="checklist plan-alumnos-flat">' +
            (alumnos.length ? alumnos.map((alumno) => {
              const alumnoId = String(alumno.alumno_id || '').trim();
              const label = getAlumnoNameLabel(alumno);
              const groupId = String(alumno._builder_group_id || alumno.grupo_id || '').trim();
              const group = getCatalogIndex().gruposById.get(groupId);
              const groupLabel = group ? getGrupoDisplayName(group) : groupId;
              const selectable = isPlanEditorAlumnoSelectable(alumno);
              return (
                '<label class="check-item">' +
                  '<input type="checkbox" data-group-id="' + escapeHtml(groupId) + '" value="' + escapeHtml(alumnoId) + '"' + (selected.has(alumnoId) && selectable ? ' checked' : '') + (selectable ? '' : ' disabled') + '>' +
                  '<span><strong>' + escapeHtml(label) + '</strong>' + (groupLabel ? ' <span class="mini">&middot; ' + escapeHtml(groupLabel) + '</span>' : '') + (selectable ? '' : '<span class="mini">No activo</span>') + '</span>' +
                '</label>'
              );
            }).join('') : '<div class="empty">No hay alumnos activos en los grupos seleccionados.</div>') +
          '</div>' +
        '</div>';
        return;
      }
      host.innerHTML = groupIds.map((groupId) => {
        const group = getCatalogIndex().gruposById.get(String(groupId || '').trim());
        const alumnos = getPlanEditorAlumnosByGroupId(groupId);
        const selectedCount = alumnos.filter((alumno) => selected.has(String(alumno.alumno_id || '').trim())).length;
        return (
            '<div class="group-block">' +
              '<div class="group-block-head">' +
                '<div><strong>' + escapeHtml(group ? getGrupoDisplayName(group) : groupId) + '</strong><span class="mini">' + escapeHtml(String(selectedCount)) + ' de ' + escapeHtml(String(alumnos.length)) + ' seleccionado(s)</span></div>' +
              '</div>' +
            '<div class="checklist">' +
              (alumnos.length ? alumnos.map((alumno) => {
                const label = getAlumnoNameLabel(alumno);
                const alumnoId = String(alumno.alumno_id || '').trim();
                const selectable = isPlanEditorAlumnoSelectable(alumno);
                return (
                  '<label class="check-item">' +
                    '<input type="checkbox" data-group-id="' + escapeHtml(groupId) + '" value="' + escapeHtml(alumnoId) + '"' + (selected.has(alumnoId) && selectable ? ' checked' : '') + (selectable ? '' : ' disabled') + '>' +
                    '<span><strong>' + escapeHtml(label) + '</strong>' + (selectable ? '' : '<span class="mini">No activo</span>') + '</span>' +
                  '</label>'
                );
              }).join('') : '<div class="empty">' + (getSelectedPlanTallerId() ? 'No hay alumnos de este taller en este grupo.' : 'No hay alumnos activos en este grupo.') + '</div>') +
            '</div>' +
          '</div>'
        );
      }).join('');
    }

    function handlePlanGroupChecklistChange(event) {
      const input = event && event.target;
      if (!input || input.type !== 'checkbox') return;
      clearPlanEditorValidation('planGruposChecklist');
      clearPlanEditorValidation('planAlumnosChecklist');
      const selected = applyGroupSelectionToAlumnoSet(new Set(getSelectedPlanAlumnos()), input.value, !!input.checked);
      renderPlanAlumnosChecklist(selected);
    }

    function getOpenPlanInlineFieldId(plan, fieldName) {
      const planId = String(plan && plan.planeacion_id || plan && plan.planId || state.openPlanId || '').trim();
      return 'open-plan-' + String(fieldName || '').trim() + '-' + planId;
    }

    function handlePlanTallerChanged(event) {
      if (state.planEditor.mode === 'edit') return;
      const select = event && event.currentTarget ? event.currentTarget : $('planSubmateria');
      const tallerId = select ? String(select.value || '').trim() : '';
      state.planEditor.selectedTallerId = tallerId;
      clearPlanEditorValidation('planGruposChecklist');
      clearPlanEditorValidation('planAlumnosChecklist');
      clearPlanEditorValidation('planSubmateria');
      state.planEditor.selectedSubmateriaId = getDefaultPlanSubmateriaIdForMateria($('planMateria') ? $('planMateria').value : '');
      if (tallerId) {
        renderPlanGroupChecklist();
        renderPlanAlumnosChecklist(new Set(Array.from(getPlanTallerAlumnoIdSet(tallerId))));
        return;
      }
      renderPlanGroupChecklist();
      renderPlanAlumnosChecklist(new Set(getSelectedPlanAlumnos()));
    }

    function renderPlanActivitiesEditor() {
      const host = $('planActivitiesList');
      if (!state.planEditor.activities.length) state.planEditor.activities = [createEmptyActivityDraft()];
      const showSeguimientoFields = canUseAdminShell() && state.planEditor.mode === 'edit';
      host.innerHTML = state.planEditor.activities.map((activity, index) => {
        const seguimientoHtml = showSeguimientoFields
          ? '<div class="activity-inline-grid">' +
              '<div><label>Material</label><select onchange="updateEditorActivityField(' + index + ', \'material_en_carpeta\', this.value)"><option value="no_requiere"' + (activity.material_en_carpeta === 'no_requiere' ? ' selected' : '') + '>No requiere</option><option value="listo"' + (activity.material_en_carpeta === 'listo' ? ' selected' : '') + '>Listo</option><option value="no_listo"' + (activity.material_en_carpeta === 'no_listo' ? ' selected' : '') + '>No listo</option></select></div>' +
              '<div><label>¿Se realizó esta actividad?</label><select onchange="updateEditorActivityField(' + index + ', \'realizada\', this.value)"><option value=""' + (!activity.realizada ? ' selected' : '') + '>Pendiente</option><option value="si"' + (activity.realizada === 'si' ? ' selected' : '') + '>Sí</option><option value="no"' + (activity.realizada === 'no' ? ' selected' : '') + '>No</option></select></div>' +
              '<div><label>Comentario</label><input type="text" value="' + escapeHtml(activity.comentario_cierre || '') + '" onchange="updateEditorActivityField(' + index + ', \'comentario_cierre\', this.value)"></div>' +
            '</div>'
          : '<div class="activity-inline-grid">' +
              '<div><label>Material</label><select onchange="updateEditorActivityField(' + index + ', \'material_en_carpeta\', this.value)"><option value="no_requiere"' + (activity.material_en_carpeta === 'no_requiere' ? ' selected' : '') + '>No requiere</option><option value="listo"' + (activity.material_en_carpeta === 'listo' ? ' selected' : '') + '>Listo</option><option value="no_listo"' + (activity.material_en_carpeta === 'no_listo' ? ' selected' : '') + '>No listo</option></select></div>' +
              '<div class="helper" style="grid-column: span 2;">El seguimiento de realizada / no realizada se captura al cerrar la semana.</div>' +
            '</div>';
        return (
          '<div class="activity-editor">' +
            '<div class="activity-editor-top">' +
              '<span class="activity-chip">Actividad ' + (index + 1) + '</span>' +
              '<div class="actions compact activity-remove-desktop">' +
                '<button class="btn-ghost" type="button" onclick="removeEditorActivity(' + index + ')">Quitar</button>' +
              '</div>' +
            '</div>' +
            '<textarea onchange="updateEditorActivityField(' + index + ', \'texto\', this.value)">' + escapeHtml(activity.texto || '') + '</textarea>' +
            seguimientoHtml +
            '<div class="activity-remove-mobile">' +
              '<button class="btn-ghost" type="button" onclick="removeEditorActivity(' + index + ')">Quitar actividad</button>' +
            '</div>' +
          '</div>'
        );
      }).join('');
    }

    function renderPlanEditor() {
      const isEdit = state.planEditor.mode === 'edit';
      const currentPlan = isEdit ? getPlanById(state.planEditor.planId) : null;
      const canEditDate = !isEdit || canUseAdminShell() || (currentPlan && ['borrador', 'activa', 'rechazada'].includes(String(currentPlan.estado || '').trim()));
      const catalogsLoading = !!(state.ui && state.ui.planeacionesCatalogosLoading) && currentViewNeedsCatalogos();
      const loadingNote = $('planBuilderLoadingNote');
      const primarySaveBtn = $('savePlanBtn');
      const draftSaveBtn = $('savePlanDraftBtn');
      const activeSaveBtn = $('savePlanActiveBtn');
      $('planEditorTitle').textContent = isEdit ? 'Editar planeaci\u00f3n' : 'Plan';
      if (primarySaveBtn) {
        primarySaveBtn.hidden = !isEdit;
        primarySaveBtn.textContent = 'Guardar cambios';
        primarySaveBtn.disabled = catalogsLoading;
      }
      if (draftSaveBtn) {
        draftSaveBtn.hidden = isEdit;
        draftSaveBtn.disabled = catalogsLoading;
      }
      if (activeSaveBtn) {
        activeSaveBtn.hidden = isEdit;
        activeSaveBtn.disabled = catalogsLoading;
      }
      $('planFecha').disabled = !canEditDate;
      $('planMateria').disabled = catalogsLoading;
      if ($('planSubmateria')) $('planSubmateria').disabled = catalogsLoading;
      $('planFrase').disabled = catalogsLoading;
      $('selectAllVisibleAlumnosBtn').disabled = catalogsLoading;
      $('clearVisibleAlumnosBtn').disabled = catalogsLoading;
      $('addActivityBtn').disabled = catalogsLoading;
      if (loadingNote) loadingNote.hidden = !catalogsLoading;
      renderPlanWeekResolved();
      syncPlanEditorWeekValidation();
      syncPlanEditorActionAvailability(catalogsLoading);
      syncPlanSubmateriaSelect();
      renderPlanGroupChecklist();
      renderPlanAlumnosChecklist();
      renderPlanActivitiesEditor();
      renderPlanBuilderVisibility();
      renderPlanEditorValidation();
    }

    function renderBaseSelects(options = {}) {
      const shouldRenderPlaneaciones = options.planeaciones !== false && (
        currentViewNeedsPlaneaciones() ||
        isPlaneacionesSurfaceVisible() ||
        isPlanBuilderExpanded() ||
        !!state.openPlanId
      );
      const shouldRenderSeguimiento = !!options.seguimiento;
      const shouldRenderReportes = !!options.reportes;

      if (shouldRenderPlaneaciones) {
        fillSelect($('planMateria'), state.catalogos.materias, (m) => m.materia_id, (m) => m.nombre || m.materia_id, 'Selecciona materia');
        syncPlanSubmateriaSelect();
        renderPlaneacionesFilterSelects();
        fillSelect($('filterGrupo'), state.catalogos.grupos, (g) => g.grupo_id, (g) => getGrupoDisplayName(g), 'Todos los grupos');
        if (canUseAdminShell()) {
          fillSelect($('filterFacilitador'), state.catalogos.facilitadores.filter((item) => isTruthyValue(item.activo)), (f) => f.facilitador_id, (f) => f.nombre_mostrado || f.nombre_completo || f.facilitador_id, 'Todos los facilitadores');
        }
        renderPlanEditor();
      }

      if (shouldRenderSeguimiento) {
        fillSelect($('evaAlumno'), state.catalogos.alumnos, (a) => a.alumno_id, (a) => getAlumnoSelectLabel(a), 'Selecciona alumno');
        fillSelect($('notaAlumno'), state.catalogos.alumnos, (a) => a.alumno_id, (a) => getAlumnoSelectLabel(a), 'Selecciona alumno');
        fillSelect($('evaMateria'), state.catalogos.materias, (m) => m.materia_id, (m) => m.nombre || m.materia_id, 'Selecciona materia');
        fillSelect($('obsPlan'), state.planeaciones, (p) => p.planeacion_id, (p) => formatPlanShort(p), 'Selecciona planeaci\u00f3n');
      }

      if (shouldRenderReportes) {
        const reportUi = getReportSelectionState();
        fillSelect($('repAlumno'), state.catalogos.alumnos, (a) => a.alumno_id, (a) => getAlumnoSelectLabel(a), 'Selecciona alumno');
        if ($('repAlumno') && reportUi.alumno_id) $('repAlumno').value = reportUi.alumno_id;
      }
    }

    function renderPlaneacionesFilterSelects() {
      const semanaFilter = $('filterSemana');
      const estadoFilter = $('filterEstado');
      if (semanaFilter) {
        fillSelect(
          semanaFilter,
          getPlaneacionesFilterSemanas(),
          (semana) => String(semana && semana.semana_id || '').trim(),
          (semana) => semana.nombre_visible || semana.semana_id,
          'Todas las semanas'
        );
      }
      if (estadoFilter) {
        fillSelect(
          estadoFilter,
          getPlanStatusFilterOptions(),
          (status) => status.value,
          (status) => status.label,
          'Todos los estados'
        );
      }
    }

    function updateEditorActivityField(index, field, value) {
      if (!state.planEditor.activities[index]) return;
      state.planEditor.activities[index][field] = value;
      clearPlanEditorValidation('planActivitiesList');
    }

    function addEditorActivity() {
      clearPlanEditorValidation('planActivitiesList');
      state.planEditor.activities.push(createEmptyActivityDraft());
      renderPlanActivitiesEditor();
    }

    function removeEditorActivity(index) {
      if (state.planEditor.activities.length <= 1) return;
      clearPlanEditorValidation('planActivitiesList');
      state.planEditor.activities.splice(index, 1);
      renderPlanActivitiesEditor();
    }

    function moveEditorActivity(index, direction) {
      const target = index + direction;
      if (target < 0 || target >= state.planEditor.activities.length) return;
      clearPlanEditorValidation('planActivitiesList');
      const copy = [...state.planEditor.activities];
      const temp = copy[index];
      copy[index] = copy[target];
      copy[target] = temp;
      state.planEditor.activities = copy;
      renderPlanActivitiesEditor();
    }

    function togglePlanAlumnosByGroup(groupId, checked) {
      Array.from($('planAlumnosChecklist').querySelectorAll('input[data-group-id="' + groupId + '"]')).forEach((input) => {
        input.checked = checked;
      });
    }

    function toggleAllVisibleAlumnos(checked) {
      clearPlanEditorValidation('planAlumnosChecklist');
      Array.from($('planAlumnosChecklist').querySelectorAll('input[type="checkbox"]')).forEach((input) => {
        input.checked = checked;
      });
    }

    function toggleAllGroups(checked) {
      if (state.planEditor.mode === 'edit') return;
      clearPlanEditorValidation('planGruposChecklist');
      clearPlanEditorValidation('planAlumnosChecklist');
      Array.from($('planGruposChecklist').querySelectorAll('input[type="checkbox"]')).forEach((input) => {
        input.checked = checked;
      });
      if (!checked) {
        renderPlanAlumnosChecklist(new Set());
        return;
      }
      const selected = new Set();
      getSelectedGroupIds().forEach((groupId) => applyGroupSelectionToAlumnoSet(selected, groupId, true));
      renderPlanAlumnosChecklist(selected);
    }

    function renderObsAlumnoSelect() {
      const plan = getPlanById($('obsPlan').value);
      const host = $('obsAlumno');
      if (!plan) {
        host.innerHTML = '<option value="">Selecciona alumno</option>';
        return;
      }
      const alumnos = (plan.alumnos || []).map((pa) => {
        const alumno = state.catalogos.alumnos.find((row) => row.alumno_id === pa.alumno_id);
        return {
          alumno_id: pa.alumno_id,
          nombre: alumno ? getAlumnoNameLabel(alumno) : (pa.nombre_snapshot || formatAlumnoCompactId(pa.alumno_id)),
          label: alumno ? getAlumnoSelectLabel(alumno) : joinUniqueAlumnoLabelParts([pa.nombre_snapshot, formatAlumnoCompactId(pa.alumno_id)])
        };
      });
      fillSelect(host, alumnos, (a) => a.alumno_id, (a) => a.label, 'Selecciona alumno');
    }

    function renderEvaluationDependencies() {
      const materiaId = $('evaMateria').value;
      const submaterias = state.catalogos.submaterias.filter((item) => !materiaId || item.materia_id === materiaId);
      const habilidades = state.catalogos.habilidades.filter((item) => !materiaId || item.materia_id === materiaId);
      fillSelect($('evaSubmateria'), submaterias, (item) => item.submateria_id, (item) => item.nombre || item.submateria_id, 'Selecciona submateria');
      fillSelect($('evaHabilidad'), habilidades, (item) => item.habilidad_id, (item) => item.nombre || item.habilidad_id, 'Selecciona habilidad');
    }
    function renderAlumnoFilterUi() {
      const search = $('filterAlumnoSearch');
      const dataList = $('filterAlumnoSuggestions');
      const hidden = $('filterAlumnoId');
      const chip = $('filterAlumnoChip');
      if (!search || !dataList || !hidden || !chip) return;
      const rows = [...state.catalogos.alumnos]
        .map((alumno) => {
          const label = getAlumnoSelectLabel(alumno);
          return { id: alumno.alumno_id, label };
        })
        .sort((a, b) => a.label.localeCompare(b.label, 'es', { sensitivity: 'base' }));
      dataList.innerHTML = rows.map((row) => '<option value="' + escapeHtml(row.label) + '"></option>').join('');
      const active = rows.find((row) => row.id === hidden.value) || null;
      chip.textContent = active ? ('Alumno: ' + active.label) : 'Sin filtro de alumno';
      if (active && search.value !== active.label) search.value = active.label;
    }

    function syncAlumnoFilterFromInput() {
      const search = $('filterAlumnoSearch');
      const hidden = $('filterAlumnoId');
      if (!search || !hidden) return;
      const query = String(search.value || '').trim().toLowerCase();
      if (!query) {
        hidden.value = '';
        renderAlumnoFilterUi();
        return;
      }
      const match = state.catalogos.alumnos.find((alumno) => {
        return getAlumnoSearchLabels(alumno)
          .map((label) => label.toLowerCase())
          .includes(query);
      });
      hidden.value = match ? match.alumno_id : '';
      renderAlumnoFilterUi();
    }

    function clearAlumnoFilter() {
      if ($('filterAlumnoSearch')) $('filterAlumnoSearch').value = '';
      if ($('filterAlumnoId')) $('filterAlumnoId').value = '';
      renderAlumnoFilterUi();
    }

    function syncNotePeriodoState() {
      const alcance = $('notaAlcance').value;
      const periodo = $('notaPeriodo');
      const isGlobal = alcance === 'global';
      periodo.disabled = isGlobal;
      if (isGlobal) {
        periodo.value = '';
      }
    }

    function getVisiblePlaneaciones() {
      const role = state.session && state.session.usuario ? state.session.usuario.rol : '';
      let rows = [...state.planeaciones];
      const materiaFilter = String((state.ui && state.ui.planeacionesMateriaFilter) || '').trim();
      if (role === 'facilitador') {
        rows = rows.filter((plan) => !['cerrada', 'archivada', 'cierre_pendiente'].includes(plan.estado));
      }
      if (materiaFilter) {
        rows = rows.filter((plan) => String(plan.materia_id || '').trim() === materiaFilter);
      }
      if (role !== 'facilitador') {
        rows = sortAdminPlaneacionesByStatus(rows);
      }
      return rows;
    }

    function getPlanGeneralObservations(plan) {
      return Array.isArray(plan.obs_semana) ? plan.obs_semana : [];
    }

    function getPlanAlumnoFinalMap(plan) {
      return (Array.isArray(plan.obs_alumno_final) ? plan.obs_alumno_final : []).reduce((acc, row) => {
        acc[row.alumno_id] = row;
        return acc;
      }, {});
    }

    function getPlaneacionEntryAlumnoRows(entry) {
      return (entry && entry.plans || []).flatMap((plan) => {
        const grupo = getGrupoById(plan.grupo_id);
        const grupoLabel = grupo ? getGrupoDisplayName(grupo) : plan.grupo_id;
        return (Array.isArray(plan.alumnos) ? plan.alumnos : []).map((row) => Object.assign({}, row, {
          planeacion_id: plan.planeacion_id,
          grupo_id: plan.grupo_id,
          grupo_label: grupoLabel
        }));
      });
    }

    function getPlaneacionEntryAlumnoFinalMap(entry) {
      return (entry && entry.plans || []).reduce((acc, plan) => {
        (Array.isArray(plan.obs_alumno_final) ? plan.obs_alumno_final : []).forEach((row) => {
          acc[plan.planeacion_id + '::' + row.alumno_id] = row;
        });
        return acc;
      }, {});
    }

    function hydrateOpenPlanAfterOpen(planId) {
      ensurePlaneacionDetailLoaded(planId, { silent: true })
        .then((plan) => {
          if (state.openPlanId !== planId) return null;
          const entry = plan ? getPlaneacionEntryByKey(getPlaneacionEntryKey(plan)) : null;
          if (entry && entry.isMulti) {
            ensurePlaneacionEntryDetailsLoaded(entry, { silent: true }).then(() => {
              if (state.openPlanId !== planId) return;
              const refreshedPlan = getPlanById(planId) || plan;
              if (refreshedPlan && hasUsableOpenPlanDetail(refreshedPlan)) {
                state.openPlanDraft = preserveOpenPlanDraftLocalEdits(planId, buildOpenPlanDraft(refreshedPlan), refreshedPlan);
              }
              persistCurrentBootSnapshot('planeacion_abierta_multigrupo');
              renderPlaneacionesList();
            }).catch(() => {});
          }
          if (state.ui) state.ui.openPlanLoadingId = '';
          if (plan && hasUsableOpenPlanDetail(plan)) {
            state.openPlanDraft = preserveOpenPlanDraftLocalEdits(planId, buildOpenPlanDraft(plan), plan);
          }
          persistCurrentBootSnapshot('planeacion_abierta');
          renderPlaneacionesList();
          scheduleAfterPaint(() => {
            if (state.openPlanId !== planId) return null;
            return ensurePlaneacionObservacionesLoaded(planId, { silent: true })
              .then(() => {
                if (state.openPlanId !== planId) return;
                renderPlaneacionesList();
              })
              .catch(() => null);
          }, 120);
          scheduleAfterPaint(() => {
            if (state.openPlanId !== planId) return null;
            return ensurePlaneacionesCatalogosAvailable({ render: false, scope: 'editor' })
              .then(() => {
                if (state.openPlanId !== planId) return;
                const refreshedPlan = getPlanById(planId) || plan;
                if (refreshedPlan && hasUsableOpenPlanDetail(refreshedPlan)) {
                  state.openPlanDraft = preserveOpenPlanDraftLocalEdits(planId, buildOpenPlanDraft(refreshedPlan), refreshedPlan);
                }
                renderPlaneacionesList();
              })
              .catch(() => state.catalogos);
          }, 140);
          scheduleAfterPaint(() => {
            if (state.openPlanId !== planId) return null;
            const currentOpenPlan = getPlanById(planId);
            if (currentOpenPlan && currentOpenPlan.detail_loaded) return null;
            return ensurePlaneacionDetailLoaded(planId, { silent: true, force: true })
              .then((retryPlan) => {
                if (state.openPlanId !== planId) return;
                if (state.ui) state.ui.openPlanLoadingId = '';
                if (retryPlan && hasUsableOpenPlanDetail(retryPlan)) {
                  state.openPlanDraft = preserveOpenPlanDraftLocalEdits(planId, buildOpenPlanDraft(retryPlan), retryPlan);
                }
                renderPlaneacionesList();
              })
              .catch(() => null);
          }, 2600);
          return null;
        })
        .catch((err) => {
          if (state.openPlanId !== planId) return;
          if (state.ui && state.ui.openPlanLoadingId === planId) {
            state.ui.openPlanLoadingId = '';
          }
          renderPlaneacionesList();
          setBanner((err && err.message) || 'No se pudo abrir la planeación. Intenta de nuevo.', 'error');
        });
    }

    async function togglePlanOpen(button, planId) {
      if (state.openPlanId === planId) {
        state.openPlanId = '';
        state.openPlanDraft = null;
        if (state.ui) state.ui.openPlanLoadingId = '';
        persistCurrentBootSnapshot('planeacion_cerrada');
        renderPlaneacionesList();
        return;
      }
      const currentPlan = getPlanById(planId);
      if (isPlaneacionBlockedForActions(currentPlan)) {
        notifyPlaneacionStillSyncing(button);
        return;
      }
      openPlanLocalInstant(planId);
      hydrateOpenPlanAfterOpen(planId);
      if (state.openPlanId) {
        window.requestAnimationFrame(() => {
          const card = $('plan-card-' + planId);
          if (card && typeof card.scrollIntoView === 'function') {
            card.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      }
    }

    function renderOpenPlanGroupSpecificEditor(plan) {
      const draft = getOpenPlanDraft(plan);
      if (!draft) {
        return (
          '<div class="plan-inline-feedback is-pending">' +
            '<span class="plan-inline-feedback-dot" aria-hidden="true"></span>' +
            '<span class="plan-inline-feedback-label">Abriendo</span>' +
            '<span class="plan-inline-feedback-text">Cargando alumnos y actividades...</span>' +
          '</div>'
        );
      }
      const entry = getPlaneacionEntryByKey(getPlaneacionEntryKey(plan));
      const isMulti = !!(entry && entry.isMulti);
      const showSeguimientoFields = String(plan.estado || '').trim() === 'activa';
      const activePlanActivities = Array.isArray(plan.actividades) ? plan.actividades : [];
      const activitiesSource = Array.isArray(draft.activities) && draft.activities.some((activity) => String((activity && activity.texto) || '').trim() || String((activity && activity.actividad_id) || '').trim())
        ? draft.activities
        : activePlanActivities.map((activity) => ({
            key: activity.actividad_id || uid('ACTOPEN'),
            actividad_id: activity.actividad_id || '',
            texto: activity.texto || '',
            material_en_carpeta: normalizeMaterialStatus(activity.material_en_carpeta),
            realizada: normalizeRealizadaStatus(activity.realizada),
            comentario_cierre: activity.comentario_cierre || '',
            last_known_updated_at: activity.fecha_actualizacion || ''
          }));
      const activitiesHtml = isMulti ? '' : activitiesSource.map((activity, index) => (
        '<div class="activity-editor">' +
          '<div class="activity-editor-top">' +
            '<span class="activity-chip">Actividad ' + (index + 1) + '</span>' +
          '</div>' +
          '<div class="activity-inline-grid">' +
            '<div><label>Material</label><select id="activity-material-' + escapeHtml(activity.actividad_id) + '" onchange="updateOpenPlanDraftActivityField(' + index + ', \'material_en_carpeta\', this.value)">' +
              '<option value="no_requiere"' + (activity.material_en_carpeta === 'no_requiere' ? ' selected' : '') + '>No requiere</option>' +
              '<option value="listo"' + (activity.material_en_carpeta === 'listo' ? ' selected' : '') + '>Listo</option>' +
              '<option value="no_listo"' + (activity.material_en_carpeta === 'no_listo' ? ' selected' : '') + '>No listo</option>' +
            '</select></div>' +
            (showSeguimientoFields
              ? '<div><label>¿Se realizó esta actividad?</label><select id="activity-realizada-' + escapeHtml(activity.actividad_id) + '" onchange="updateOpenPlanDraftActivityField(' + index + ', \'realizada\', this.value)">' +
                  '<option value=""' + (!activity.realizada ? ' selected' : '') + '>Pendiente</option>' +
                  '<option value="si"' + (activity.realizada === 'si' ? ' selected' : '') + '>Sí</option>' +
                  '<option value="no"' + (activity.realizada === 'no' ? ' selected' : '') + '>No</option>' +
                '</select></div>' +
                '<div><label>Comentario</label><input id="activity-comment-' + escapeHtml(activity.actividad_id) + '" type="text" value="' + escapeHtml(activity.comentario_cierre || '') + '" onchange="updateOpenPlanDraftActivityField(' + index + ', \'comentario_cierre\', this.value)"></div>'
              : '<div class="helper" style="grid-column: span 2;">El seguimiento de realizada / no realizada se captura al cerrar la semana.</div>') +
          '</div>' +
        '</div>'
      )).join('');

      const allStudentBlocks = (() => {
        const plansToRender = isMulti ? (entry.plans || []) : [plan];
        return plansToRender.map((groupPlan) => {
          const isActiveGroup = groupPlan.planeacion_id === plan.planeacion_id;
          const groupDraft = isActiveGroup ? draft : null;
          const initialSelectedIds = (
            isActiveGroup
              ? (groupDraft && groupDraft.alumnos_ids || [])
              : ((Array.isArray(groupPlan.alumnos) ? groupPlan.alumnos : []).map((row) => row.alumno_id))
          );
          const alumnosGrupoCatalogo = getAlumnosByGroupId(groupPlan.grupo_id);
          const alumnosGrupo = alumnosGrupoCatalogo.length
            ? alumnosGrupoCatalogo
            : ((Array.isArray(groupPlan.alumnos) ? groupPlan.alumnos : []).map((row) => ({
                alumno_id: row.alumno_id,
                grupo_id: groupPlan.grupo_id,
                nombre_mostrado: row.nombre_snapshot || row.alumno_id,
                nombre_completo: row.nombre_snapshot || row.alumno_id
              })));
          const selectedIds = new Set(
            (!initialSelectedIds.length &&
              Number(groupPlan.alumnos_count || 0) > 0 &&
              Number(groupPlan.alumnos_count || 0) === alumnosGrupo.length)
              ? alumnosGrupo.map((alumno) => alumno.alumno_id)
              : initialSelectedIds
          );
          const grupo = getGrupoById(groupPlan.grupo_id);
          const grupoLabel = grupo ? getGrupoDisplayName(grupo) : groupPlan.grupo_id;
          const selectedCount = selectedIds.size || Number(groupPlan.alumnos_count || 0);
          const totalCount = alumnosGrupo.length || Number(groupPlan.alumnos_count || 0);
          if (isMulti && !isActiveGroup) {
            return (
              '<div class="group-block plan-multigroup-student-row is-collapsed">' +
                '<div class="plan-multigroup-student-summary">' +
                  '<div class="plan-multigroup-student-title">' +
                    '<strong>' + escapeHtml(grupoLabel) + '</strong>' +
                    '<span class="mini">' + escapeHtml(String(selectedCount)) + '/' + escapeHtml(String(totalCount || selectedCount)) + ' alumnos</span>' +
                  '</div>' +
                  '<button class="btn-ghost plan-multigroup-edit-btn" type="button" onclick="switchMultiGroupPlan(\'' + escapeJsAttrValue(groupPlan.planeacion_id) + '\')">Editar</button>' +
                '</div>' +
              '</div>'
            );
          }
          return (
            '<div class="group-block' + (isMulti ? ' plan-multigroup-student-row is-active' : '') + '">' +
              '<div class="group-block-head">' +
                '<div><strong>' + escapeHtml(grupoLabel) + '</strong>' + (isMulti ? '<span class="mini">' + escapeHtml(String(selectedCount)) + '/' + escapeHtml(String(totalCount || selectedCount)) + ' alumnos</span>' : '') + '</div>' +
                (isActiveGroup
                  ? '<div class="actions compact">' +
                      '<button class="btn-ghost" type="button" onclick="toggleAllOpenPlanDraftAlumnos(true)">Seleccionar todos</button>' +
                      '<button class="btn-ghost" type="button" onclick="toggleAllOpenPlanDraftAlumnos(false)">Limpiar</button>' +
                    '</div>'
                  : '') +
              '</div>' +
              '<div class="group-block plan-open-students">' +
                (alumnosGrupo.map((alumno) => (
                  '<label class="check-item">' +
                    '<input type="checkbox" value="' + escapeHtml(alumno.alumno_id) + '"' + (selectedIds.has(alumno.alumno_id) ? ' checked' : '') + (isActiveGroup ? '' : ' disabled') + ' onchange="toggleOpenPlanDraftAlumno(\'' + escapeJsAttrValue(alumno.alumno_id) + '\', this.checked)">' +
                    '<span><strong>' + escapeHtml(getAlumnoNameLabel(alumno)) + '</strong></span>' +
                  '</label>'
                )).join('') || '<div class="empty">No hay alumnos activos en este grupo.</div>') +
              '</div>' +
            '</div>'
          );
        }).join('');
      })();

      return (
        '<div class="plan-open-editor plan-open-editor-group' + (isMulti ? ' is-multigroup-compact' : '') + '">' +
          '<div>' +
            '<div class="card-head inline-head">' +
              '<div><label>' + (isMulti ? 'Alumnos' : 'Alumnos del grupo') + '</label>' + (isMulti ? '' : '<p class="subtle">Esta selecci&oacute;n solo afecta al grupo actual.</p>') + '</div>' +
            '</div>' +
            '<div class="stack">' + allStudentBlocks + '</div>' +
          '</div>' +
          (isMulti
            ? ''
            : '<div>' +
            '<div class="card-head inline-head">' +
              '<div><label>Seguimiento del grupo</label><p class="subtle">Material, realizada y comentario se guardan por grupo.</p></div>' +
            '</div>' +
            '<div class="stack">' + activitiesHtml + '</div>' +
          '</div>') +
        '</div>'
      );
    }

    function renderMultiGroupSharedActivities(entry) {
      const draft = getMultiGroupSharedDraft(entry);
      if (!draft) return '';
      return (
        '<div class="plan-multigroup-activities-compact">' +
          '<div class="card-head inline-head">' +
            '<div><label>Actividades</label></div>' +
          '</div>' +
          '<div class="stack">' + (draft.activities || []).map((activity, index) => {
            const activityId = String((activity && (activity.actividad_id || activity.key)) || '').trim();
            const materialFieldId = activityId ? ' id="activity-material-' + escapeHtml(activityId) + '"' : '';
            const realizadaFieldId = activityId ? ' id="activity-realizada-' + escapeHtml(activityId) + '"' : '';
            const comentarioFieldId = activityId ? ' id="activity-comment-' + escapeHtml(activityId) + '"' : '';
            return (
              '<div class="activity-editor">' +
                '<div class="activity-editor-top">' +
                  '<span class="activity-chip">Actividad ' + (index + 1) + '</span>' +
                  '<div class="actions compact">' +
                    '<button class="btn-ghost" type="button" onclick="removeMultiGroupSharedActivity(\'' + escapeJsAttrValue(entry.key) + '\', ' + index + ')">Quitar</button>' +
                  '</div>' +
                '</div>' +
                '<textarea onchange="updateMultiGroupSharedActivityField(\'' + escapeJsAttrValue(entry.key) + '\', ' + index + ', \'texto\', this.value)">' + escapeHtml(activity.texto || '') + '</textarea>' +
                '<div class="activity-inline-grid">' +
                  '<div><label>Material compartido</label><select' + materialFieldId + ' onchange="updateMultiGroupSharedActivityField(\'' + escapeJsAttrValue(entry.key) + '\', ' + index + ', \'material_en_carpeta\', this.value)">' +
                    '<option value="no_requiere"' + (activity.material_en_carpeta === 'no_requiere' ? ' selected' : '') + '>No requiere</option>' +
                    '<option value="listo"' + (activity.material_en_carpeta === 'listo' ? ' selected' : '') + '>Listo</option>' +
                    '<option value="no_listo"' + (activity.material_en_carpeta === 'no_listo' ? ' selected' : '') + '>No listo</option>' +
                  '</select></div>' +
                  '<div><label>¿Se realizó?</label><select' + realizadaFieldId + ' onchange="updateMultiGroupSharedActivityField(\'' + escapeJsAttrValue(entry.key) + '\', ' + index + ', \'realizada\', this.value)">' +
                    '<option value=""' + (!activity.realizada ? ' selected' : '') + '>Pendiente</option>' +
                    '<option value="si"' + (activity.realizada === 'si' ? ' selected' : '') + '>Sí</option>' +
                    '<option value="no"' + (activity.realizada === 'no' ? ' selected' : '') + '>No</option>' +
                  '</select></div>' +
                  '<div><label>Comentario compartido</label><input' + comentarioFieldId + ' type="text" value="' + escapeHtml(activity.comentario_cierre || '') + '" onchange="updateMultiGroupSharedActivityField(\'' + escapeJsAttrValue(entry.key) + '\', ' + index + ', \'comentario_cierre\', this.value)"></div>' +
                '</div>' +
              '</div>'
            );
          }).join('') + '</div>' +
          '<div class="plan-activities-add-wrap">' +
            '<button class="btn-accent plan-activities-add-btn" type="button" onclick="addMultiGroupSharedActivity(\'' + escapeJsAttrValue(entry.key) + '\')">Agregar otra actividad</button>' +
          '</div>' +
        '</div>'
      );
    }

    function renderMultiGroupSharedEditor(entry) {
      const draft = getMultiGroupSharedDraft(entry);
      if (!draft) return '';
      const selectedPlan = getOpenPlaneacionEntry(entry);
      const selectedMateriaId = String((draft && draft.materia_id) || (selectedPlan || {}).materia_id || '').trim();
      const selectedSubmaterias = getPlanSubmateriasForMateria(selectedMateriaId);
      const displayFechaPlaneacion = draft.fecha_planeacion || getWeekStartDateForPlan(selectedPlan);
      const week = resolveWeekForPlanDate(selectedPlan, displayFechaPlaneacion);
      const weekText = week ? formatSemanaLabel(week) : 'Selecciona una fecha.';
      return (
        '<div class="plan-multigroup-shared">' +
          '<div class="plan-multigroup-header">' +
            '<div>' +
              '<div class="plan-multigroup-title">Planeaci&oacute;n multigrupo</div>' +
              '<div class="plan-multigroup-groups">' + getPlaneacionEntryGroupLabels(entry).map((label) => '<span class="plan-multigroup-chip">' + escapeHtml(label) + '</span>').join('') + '</div>' +
            '</div>' +
            '<div class="mini">' + escapeHtml(String((entry.plans || []).length)) + ' grupos vinculados</div>' +
          '</div>' +
          '<div class="grid-3">' +
            '<div class="plan-date-detected-field"><label>Fecha:</label><input type="date" value="' + escapeHtml(displayFechaPlaneacion || '') + '" oninput="updateMultiGroupSharedField(\'' + escapeJsAttrValue(entry.key) + '\', \'fecha_planeacion\', this.value, true)" onchange="updateMultiGroupSharedField(\'' + escapeJsAttrValue(entry.key) + '\', \'fecha_planeacion\', this.value, true)"><div class="plan-date-inline-meta"><div class="plan-date-resolved-head">Semana:</div><div class="inline-note ' + (week && String(week.cerrada_global || '').toLowerCase() === 'si' ? 'is-closed' : 'is-open') + '">' + escapeHtml(weekText) + '</div></div></div>' +
            '<div><label>Materia</label><select onchange="updateMultiGroupSharedField(\'' + escapeJsAttrValue(entry.key) + '\', \'materia_id\', this.value, true)">' +
              '<option value="">Selecciona materia</option>' +
              (state.catalogos.materias || []).map((item) => '<option value="' + escapeHtml(item.materia_id) + '"' + (String(item.materia_id || '') === selectedMateriaId ? ' selected' : '') + '>' + escapeHtml(item.nombre || item.materia_id) + '</option>').join('') +
            '</select></div>' +
            (selectedSubmaterias.length
              ? '<div><label>Submateria</label><select onchange="updateMultiGroupSharedField(\'' + escapeJsAttrValue(entry.key) + '\', \'submateria_id\', this.value, true)">' +
                  '<option value="">Selecciona submateria</option>' +
                  selectedSubmaterias.map((item) => '<option value="' + escapeHtml(item.submateria_id) + '"' + (String(draft.submateria_id || '') === String(item.submateria_id || '') ? ' selected' : '') + '>' + escapeHtml(item.nombre || item.submateria_id) + '</option>').join('') +
                '</select></div>'
              : '') +
          '</div>' +
          '<div class="plan-inline-field">' +
            '<label>Frase de la semana</label>' +
            '<textarea onchange="updateMultiGroupSharedField(\'' + escapeJsAttrValue(entry.key) + '\', \'frase_semana\', this.value)">' + escapeHtml(draft.frase_semana || '') + '</textarea>' +
          '</div>' +
        '</div>'
      );
    }

    function renderOpenPlanStructureEditor(plan, allowStructureEdit, options = {}) {
      if (!allowStructureEdit) return '';
      if (options.groupSpecificOnly) return renderOpenPlanGroupSpecificEditor(plan);
      const draft = getOpenPlanDraft(plan);
      if (!draft) {
        return (
          '<div class="plan-inline-feedback is-pending">' +
            '<span class="plan-inline-feedback-dot" aria-hidden="true"></span>' +
            '<span class="plan-inline-feedback-label">Abriendo</span>' +
            '<span class="plan-inline-feedback-text">Cargando alumnos y actividades...</span>' +
          '</div>'
        );
      }
        const selectedMateriaId = String((draft && draft.materia_id) || plan.materia_id || '').trim();
        const submaterias = getPlanSubmateriasForMateria(selectedMateriaId);
        const displayFechaPlaneacion = draft.fecha_planeacion || getWeekStartDateForPlan(plan);
        const week = resolveWeekForPlanDate(plan, displayFechaPlaneacion);
        const weekText = week ? formatSemanaLabel(week) : 'Selecciona una fecha.';
        const alumnosGrupoCatalogo = state.catalogos.alumnos.filter((alumno) => alumno.grupo_id === plan.grupo_id);
        const alumnosGrupo = alumnosGrupoCatalogo.length
          ? alumnosGrupoCatalogo
          : ((Array.isArray(plan.alumnos) ? plan.alumnos : []).map((row) => ({
              alumno_id: row.alumno_id,
              grupo_id: plan.grupo_id,
              nombre_mostrado: row.nombre_snapshot || row.alumno_id,
              nombre_completo: row.nombre_snapshot || row.alumno_id
            })));
        const selectedIds = Array.isArray(draft.alumnos_ids) && draft.alumnos_ids.length
          ? draft.alumnos_ids
          : ((plan.alumnos || []).map((row) => row.alumno_id));
        const selectedFallbackIds = !selectedIds.length &&
          Number(plan.alumnos_count || 0) > 0 &&
          Number(plan.alumnos_count || 0) === alumnosGrupo.length
          ? alumnosGrupo.map((alumno) => alumno.alumno_id)
          : selectedIds;
        const selected = new Set(selectedFallbackIds);
        const showSeguimientoFields = String(plan.estado || '').trim() === 'activa';
        const localState = getPlanLocalSaveState(plan);
        const isOpenSaveBusy = localState === 'saving';
        const openFieldIds = {
          fecha: getOpenPlanInlineFieldId(plan, 'fecha'),
          materia: getOpenPlanInlineFieldId(plan, 'materia'),
          submateria: getOpenPlanInlineFieldId(plan, 'submateria'),
          alumnos: getOpenPlanInlineFieldId(plan, 'alumnos'),
          activities: getOpenPlanInlineFieldId(plan, 'activities')
        };
        const activitiesSource = Array.isArray(draft.activities) && draft.activities.some((activity) => String((activity && activity.texto) || '').trim() || String((activity && activity.actividad_id) || '').trim())
          ? draft.activities
          : ((plan.actividades || []).length ? (plan.actividades || []).map((actividad) => ({
              key: actividad.actividad_id || uid('ACTOPEN'),
              actividad_id: actividad.actividad_id || '',
              texto: actividad.texto || '',
              material_en_carpeta: normalizeMaterialStatus(actividad.material_en_carpeta),
              realizada: normalizeRealizadaStatus(actividad.realizada),
              comentario_cierre: actividad.comentario_cierre || '',
              last_known_updated_at: actividad.fecha_actualizacion || ''
            })) : [createEmptyActivityDraft()]);
        const activitiesHtml = activitiesSource.map((activity, index) => (
          '<div class="activity-editor">' +
          '<div class="activity-editor-top">' +
            '<span class="activity-chip">Actividad ' + (index + 1) + '</span>' +
            '<div class="actions compact">' +
              '<button class="btn-ghost" type="button" onclick="removeOpenPlanDraftActivity(' + index + ')">Quitar</button>' +
            '</div>' +
          '</div>' +
          '<textarea onchange="updateOpenPlanDraftActivityField(' + index + ', \'texto\', this.value)">' + escapeHtml(activity.texto || '') + '</textarea>' +
          '<div class="activity-inline-grid">' +
            '<div><label>Material</label><select id="activity-material-' + escapeHtml(activity.actividad_id) + '" onchange="updateOpenPlanDraftActivityField(' + index + ', \'material_en_carpeta\', this.value)">' +
              '<option value="no_requiere"' + (activity.material_en_carpeta === 'no_requiere' ? ' selected' : '') + '>No requiere</option>' +
              '<option value="listo"' + (activity.material_en_carpeta === 'listo' ? ' selected' : '') + '>Listo</option>' +
              '<option value="no_listo"' + (activity.material_en_carpeta === 'no_listo' ? ' selected' : '') + '>No listo</option>' +
            '</select></div>' +
            (showSeguimientoFields
              ? '<div><label>¿Se realizó esta actividad?</label><select id="activity-realizada-' + escapeHtml(activity.actividad_id) + '" onchange="updateOpenPlanDraftActivityField(' + index + ', \'realizada\', this.value)">' +
                  '<option value=""' + (!activity.realizada ? ' selected' : '') + '>Pendiente</option>' +
                  '<option value="si"' + (activity.realizada === 'si' ? ' selected' : '') + '>Sí</option>' +
                  '<option value="no"' + (activity.realizada === 'no' ? ' selected' : '') + '>No</option>' +
                '</select></div>' +
                '<div><label>Comentario</label><input id="activity-comment-' + escapeHtml(activity.actividad_id) + '" type="text" value="' + escapeHtml(activity.comentario_cierre || '') + '" onchange="updateOpenPlanDraftActivityField(' + index + ', \'comentario_cierre\', this.value)"></div>'
              : '<div class="helper" style="grid-column: span 2;">El seguimiento de realizada / no realizada se captura al cerrar la semana.</div>') +
          '</div>' +
        '</div>'
      )).join('');

      return (
        '<div class="plan-open-editor">' +
          '<div class="grid-3">' +
            '<div class="plan-date-detected-field"><label>Fecha:</label><input id="' + escapeHtml(openFieldIds.fecha) + '" type="date" value="' + escapeHtml(displayFechaPlaneacion || '') + '" oninput="updateOpenPlanDraftField(\'fecha_planeacion\', this.value, true)" onchange="updateOpenPlanDraftField(\'fecha_planeacion\', this.value, true)"><div class="plan-date-inline-meta"><div class="plan-date-resolved-head">Semana:</div><div class="inline-note ' + (week && String(week.cerrada_global || '').toLowerCase() === 'si' ? 'is-closed' : 'is-open') + '">' + escapeHtml(weekText) + '</div></div></div>' +
            '<div><label>Materia</label><select id="' + escapeHtml(openFieldIds.materia) + '" onchange="updateOpenPlanDraftField(\'materia_id\', this.value, true)">' +
              '<option value="">Selecciona materia</option>' +
              (state.catalogos.materias || []).map((item) => '<option value="' + escapeHtml(item.materia_id) + '"' + (String(item.materia_id || '') === selectedMateriaId ? ' selected' : '') + '>' + escapeHtml(item.nombre || item.materia_id) + '</option>').join('') +
            '</select></div>' +
            (submaterias.length
              ? '<div><label>Submateria</label><select id="' + escapeHtml(openFieldIds.submateria) + '" onchange="updateOpenPlanDraftField(\'submateria_id\', this.value, true)">' +
                  '<option value="">Selecciona submateria</option>' +
                  submaterias.map((item) => '<option value="' + escapeHtml(item.submateria_id) + '"' + (String(draft.submateria_id || '') === String(item.submateria_id || '') ? ' selected' : '') + '>' + escapeHtml(item.nombre || item.submateria_id) + '</option>').join('') +
                '</select></div>'
              : '') +
          '</div>' +
          '<div class="plan-inline-field">' +
            '<label>Frase de la semana</label>' +
            '<textarea onchange="updateOpenPlanDraftField(\'frase_semana\', this.value)">' + escapeHtml(draft.frase_semana || '') + '</textarea>' +
          '</div>' +
          '<div>' +
            '<div class="card-head inline-head">' +
              '<div><label>Alumnos</label></div>' +
              '<div class="actions compact">' +
                '<button class="btn-ghost" type="button" onclick="toggleAllOpenPlanDraftAlumnos(true)">Seleccionar todos</button>' +
                '<button class="btn-ghost" type="button" onclick="toggleAllOpenPlanDraftAlumnos(false)">Limpiar</button>' +
              '</div>' +
            '</div>' +
            '<div id="' + escapeHtml(openFieldIds.alumnos) + '" class="group-block plan-open-students">' +
              (alumnosGrupo.map((alumno) => (
                '<label class="check-item">' +
                  '<input type="checkbox" value="' + escapeHtml(alumno.alumno_id) + '"' + (selected.has(alumno.alumno_id) ? ' checked' : '') + ' onchange="toggleOpenPlanDraftAlumno(\'' + escapeJsAttrValue(alumno.alumno_id) + '\', this.checked)">' +
                  '<span><strong>' + escapeHtml(getAlumnoNameLabel(alumno)) + '</strong></span>' +
                '</label>'
              )).join('') || '<div class="empty">No hay alumnos activos en este grupo.</div>') +
            '</div>' +
          '</div>' +
          '<div>' +
            '<div class="card-head inline-head">' +
              '<div><label>Actividades</label></div>' +
            '</div>' +
            '<div id="' + escapeHtml(openFieldIds.activities) + '" class="stack">' + activitiesHtml + '</div>' +
            '<div class="plan-activities-add-wrap">' +
              '<button class="btn-accent plan-activities-add-btn" type="button" onclick="addOpenPlanDraftActivity()">Agregar otra actividad</button>' +
            '</div>' +
          '</div>' +
        '</div>'
      );
    }

    function renderPlaneacionesList() {
      const host = $('planeacionesList');
      const listHead = $('planeacionesListHead');
      const role = state.session && state.session.usuario ? state.session.usuario.rol : '';
      const planeacionesLoading = !!(state.ui && state.ui.planeacionesLoading);
      const planeacionesLoaded = !!(state.ui && state.ui.planeacionesLoaded);
      const visibleEntries = getVisiblePlaneacionEntries();
      const visiblePlans = visibleEntries.flatMap((entry) => entry.plans || []);
      if (state.openPlanId && !visiblePlans.some((plan) => plan.planeacion_id === state.openPlanId)) {
        state.openPlanId = '';
        state.openPlanDraft = null;
      }
      const focusedEntry = state.openPlanId
        ? visibleEntries.find((entry) => (entry.plans || []).some((item) => item.planeacion_id === state.openPlanId))
        : null;
      const entriesToRender = focusedEntry ? [focusedEntry] : visibleEntries;
      if (listHead) listHead.hidden = !!focusedEntry;

      // BUG-12 (Facilitador Boot Empty State Guard V1):
      // Durante el boot post-login el facilitador no tiene aún state.session
      // ni state.planeaciones (api('login') tarda 5-10s, después getFacilitadorBoot
      // tarda otros segundos). En esa ventana planeacionesLoading=false,
      // planeacionesLoaded=false, plans=[] y antes caíamos al copy de "vacío"
      // que hace pensar al facilitador que no tiene planes. Ahora cualquiera
      // de estas señales activa el skeleton/loading:
      // - planeacionesLoading (refreshPlaneaciones pidiendo backend)
      // - facilitadorBootInProgress (login click → primera carga completa)
      // - sesión activa pero loaded === false (boot diferido aún en curso)
      const sessionActive = !!(state.session && state.session.token);
      const bootInProgress = !!(state.ui && state.ui.facilitadorBootInProgress && !planeacionesLoaded);
      const awaitingInitialLoad = sessionActive && !planeacionesLoaded;
      if ((planeacionesLoading || bootInProgress || awaitingInitialLoad) && !entriesToRender.length) {
        const previewCount = getPlaneacionesLoadingPreviewCount();
        host.innerHTML = previewCount > 0
          ? buildPlaneacionesListSkeleton(previewCount)
          : buildPlaneacionesLoadingEmptyState();
        return;
      }

      if (!entriesToRender.length) {
        host.innerHTML = '<div class="empty">Todavía no hay planeaciones para los filtros actuales.</div>';
        return;
      }

      const desktopHeader = (
        '<div class="plan-list-compact-head">' +
          '<span>Fecha</span>' +
          '<span>Grupo</span>' +
          '<span>Materia</span>' +
          '<span>Resumen</span>' +
          '<span>Estado</span>' +
          '<span>Acciones</span>' +
        '</div>'
      );

      let focusBar = '';
      if (focusedEntry) {
        focusBar =
          '<div class="plan-focus-shell">' +
            '<div class="plan-focus-bar">' +
              '<button class="btn-ghost plan-focus-back-btn" type="button" onclick="exitPlanFocus()">Volver a la lista</button>' +
            '</div>' +
          '</div>';
      }

      const loadMoreHtml = (!focusedEntry && state.ui && state.ui.planeacionesHasMore)
        ? (
            '<div class="plan-list-more">' +
              '<button class="btn-ghost" type="button" onclick="loadMorePlaneaciones(this)"' + ((state.ui && state.ui.planeacionesLoadingMore) ? ' disabled' : '') + '>' +
                ((state.ui && state.ui.planeacionesLoadingMore) ? 'Cargando...' : 'Cargar m\u00e1s') +
              '</button>' +
            '</div>'
          )
        : '';

      host.innerHTML = (focusedEntry ? focusBar : desktopHeader) + entriesToRender.map((entry) => {
        const plan = getOpenPlaneacionEntry(entry) || entry.representative;
        if (!plan) return '';
        const grupo = getGrupoById(plan.grupo_id);
        const materia = getMateriaById(plan.materia_id);
        const semana = state.catalogos.semanas.find((item) => item.semana_id === plan.semana_id);
        const displaySemana = semana || buildWeekRangeFromSemanaId(plan.semana_id);
        const groupLabel = entry.isMulti
          ? getPlaneacionEntryGroupLabels(entry).join(' \u00b7 ')
          : (grupo ? getGrupoDisplayName(grupo) : plan.grupo_id);
        const materiaLabel = getPlanMateriaDisplayLabel(plan, materia);
        const weekLabel = getWeekLabelForPlan(plan, displaySemana);
        const weekPrimaryLabel = displaySemana && displaySemana.fecha_inicio
          ? formatFechaHumana(displaySemana.fecha_inicio)
          : weekLabel;
        const weekSecondaryLabel = weekLabel && weekLabel !== weekPrimaryLabel
          ? weekLabel
          : ((displaySemana && displaySemana.nombre_visible && displaySemana.nombre_visible !== weekPrimaryLabel) ? displaySemana.nombre_visible : '');
        const weekClosed = semana && String(semana.cerrada_global || '').toLowerCase() === 'si';
        const hasAdminPower = role === 'admin' || role === 'directora';
        const alumnosRows = entry.isMulti ? getPlaneacionEntryAlumnoRows(entry) : (plan.alumnos || []);
        const obsGenerales = getPlanGeneralObservations(plan);
        const draftGeneralObservationText = state.openPlanDraft && state.openPlanDraft.planId === plan.planeacion_id
          ? String(state.openPlanDraft.generalObservationText || plan._draft_general_observation_text || '')
          : String(plan._draft_general_observation_text || '');
        const obsAlumnoFinalMap = entry.isMulti ? getPlaneacionEntryAlumnoFinalMap(entry) : getPlanAlumnoFinalMap(plan);
        const allowStructureEdit = hasAdminPower || ((['borrador', 'activa'].includes(plan.estado) && !weekClosed) || plan.estado === 'rechazada');
        const allowGeneralObs = hasAdminPower || !weekClosed;
        const allowAlumnoObs = hasAdminPower || !weekClosed;
        const allowClose = hasAdminPower
          ? ['activa', 'cierre_pendiente'].includes(plan.estado)
          : plan.estado === 'activa';
        const isOpen = isPlaneacionEntryOpen(entry);
        const hasMaterialAlert = entry.isMulti ? planEntryHasOpenMaterialAlert(entry) : planHasOpenMaterialAlert(plan.planeacion_id);
        const latestResolvedMaterialAlert = entry.isMulti ? getLatestResolvedMaterialAlertForEntry(entry) : (hasAdminPower ? getLatestResolvedMaterialAlertForPlan(plan.planeacion_id) : null);
        const materialHistoryHtml = latestResolvedMaterialAlert
          ? '<div class="plan-alert-history">Hist&oacute;rico: material resuelto ' + escapeHtml(formatFechaHumana(latestResolvedMaterialAlert.fecha_resolucion || latestResolvedMaterialAlert.fecha_creacion || '')) + '</div>'
          : '';
        const alumnosCount = entry.isMulti ? getPlaneacionEntryAlumnoCount(entry) : getPlanAlumnoCount(plan);
        const actividadesCount = entry.isMulti ? getPlaneacionEntryActividadCount(entry) : getPlanActividadCount(plan);
        const alumnosResumenText = escapeHtml(String(alumnosCount)) + ' alumno(s)';
        const phraseText = String(plan.frase_semana || '-');
        const phraseCompactClass = 'plan-compact-secondary plan-compact-truncate';
        const phraseCompactAttrs = '';
        const localFeedbackHtml = getPlanLocalFeedbackMarkup(plan);
        const badgeMeta = getPlanStatusBadgeMeta(plan);
        const badgeHtml = '<span class="badge ' + escapeHtml(badgeMeta.className) + '">' + escapeHtml(badgeMeta.label) + '</span>';
        const summaryMetaHtml = ((hasMaterialAlert || latestResolvedMaterialAlert)
          ? (
              '<div class="plan-compact-summary-meta">' +
                (hasMaterialAlert ? '<span class="plan-alert-chip">Material pendiente</span>' : '') +
                (!hasMaterialAlert && latestResolvedMaterialAlert ? '<span class="mini">Hist&oacute;rico: material resuelto ' + escapeHtml(formatFechaHumana(latestResolvedMaterialAlert.fecha_resolucion || latestResolvedMaterialAlert.fecha_creacion || '')) + '</span>' : '') +
                (entry.isMulti ? '<span class="mini">' + escapeHtml(String((entry.plans || []).length)) + ' grupos vinculados</span>' : '') +
              '</div>'
            )
          : '');
        const actividades = (plan.actividades || []).map((item) => {
          const material = normalizeMaterialStatus(item.material_en_carpeta);
          const realizada = normalizeRealizadaStatus(item.realizada);
          const editableSeguimiento = hasAdminPower || (plan.estado === 'activa' && !weekClosed);
          return (
            '<div class="activity-card">' +
              '<div><strong>' + escapeHtml(String(item.orden || '?') + '. ' + (item.texto || '')) + '</strong></div>' +
              '<div class="activity-inline-grid">' +
                '<div><label>Material</label><select id="activity-material-' + escapeHtml(item.actividad_id) + '"' + (editableSeguimiento ? '' : ' disabled') + '>' +
                  '<option value="no_requiere"' + (material === 'no_requiere' ? ' selected' : '') + '>No requiere</option>' +
                  '<option value="listo"' + (material === 'listo' ? ' selected' : '') + '>Listo</option>' +
                  '<option value="no_listo"' + (material === 'no_listo' ? ' selected' : '') + '>No listo</option>' +
                '</select></div>' +
                '<div><label>¿Se realizó esta actividad?</label><select id="activity-realizada-' + escapeHtml(item.actividad_id) + '"' + (editableSeguimiento ? '' : ' disabled') + '>' +
                  '<option value=""' + (!realizada ? ' selected' : '') + '>Pendiente</option>' +
                  '<option value="si"' + (realizada === 'si' ? ' selected' : '') + '>Sí</option>' +
                  '<option value="no"' + (realizada === 'no' ? ' selected' : '') + '>No</option>' +
                '</select></div>' +
                '<div><label>Comentario</label><input id="activity-comment-' + escapeHtml(item.actividad_id) + '" type="text" value="' + escapeHtml(item.comentario_cierre || '') + '"' + (editableSeguimiento ? '' : ' disabled') + '></div>' +
              '</div>' +
              ((hasAdminPower || editableSeguimiento)
                ? '<div class="mini">Los cambios de seguimiento se guardan con el bot&oacute;n Guardar cambios.</div>'
                : '') +
            '</div>'
          );
        }).join('');
        const obsGeneralesHtml = obsGenerales.length
          ? '<div class="obs-list">' + obsGenerales.map((obs) => (
              '<div class="obs-item">' +
                '<div>' + escapeHtml(obs.texto || '') + '</div>' +
                '<div class="mini">' + escapeHtml(formatFechaHumana(obs.fecha || obs.fecha_creacion || '')) + '</div>' +
              '</div>'
            )).join('') + '</div>'
          : '';
        const obsAlumnoHtml = alumnosRows.length
          ? '<div class="obs-grid">' + alumnosRows.map((alumnoRow) => {
              const targetPlanId = String(alumnoRow.planeacion_id || plan.planeacion_id || '').trim();
              const normalizedAlumnoId = String(alumnoRow.alumno_id || '').trim();
              const alumnoKey = entry.isMulti
                ? (targetPlanId + '::' + normalizedAlumnoId)
                : normalizedAlumnoId;
              const alumnoObs = obsAlumnoFinalMap[alumnoKey] || null;
              const planDraftFinalMap = Object.assign({}, plan._draft_final_observations_by_key || {});
              const draftAlumnoObs = state.openPlanDraft && state.openPlanDraft.planId === plan.planeacion_id &&
                state.openPlanDraft.finalObservationsByKey &&
                Object.prototype.hasOwnProperty.call(state.openPlanDraft.finalObservationsByKey, alumnoKey)
                  ? String(state.openPlanDraft.finalObservationsByKey[alumnoKey] || planDraftFinalMap[alumnoKey] || '')
                  : (
                      state.openPlanDraft && state.openPlanDraft.planId === plan.planeacion_id &&
                      state.openPlanDraft.finalObservationsByKey &&
                      Object.prototype.hasOwnProperty.call(state.openPlanDraft.finalObservationsByKey, normalizedAlumnoId)
                        ? String(state.openPlanDraft.finalObservationsByKey[normalizedAlumnoId] || planDraftFinalMap[normalizedAlumnoId] || '')
                        : String(planDraftFinalMap[alumnoKey] || planDraftFinalMap[normalizedAlumnoId] || '')
                    );
              const alumnoNombre = alumnoRow.nombre_snapshot || formatAlumnoCompactId(alumnoRow.alumno_id);
              return (
                '<div class="obs-alumno-card">' +
                  '<div><strong>' + escapeHtml(alumnoNombre) + '</strong>' + (entry.isMulti ? '<div class="mini">' + escapeHtml(alumnoRow.grupo_label || '') + '</div>' : '') + '</div>' +
                  '<textarea class="obs-final-input" id="obs-final-' + escapeHtml(targetPlanId) + '-' + escapeHtml(normalizedAlumnoId) + '" oninput="autoGrowObsFinal(this);updateOpenPlanFinalObservationDraft(\'' + escapeJsAttrValue(targetPlanId) + '\', \'' + escapeJsAttrValue(normalizedAlumnoId) + '\', this.value)"' + (allowAlumnoObs ? '' : ' disabled') + '>' + escapeHtml(draftAlumnoObs || (alumnoObs ? (alumnoObs.nota || '') : '')) + '</textarea>' +
                '</div>'
              );
            }).join('') + '</div>'
          : '<div class="mini">No hay alumnos ligados a esta planeación.</div>';
        const observationsLoadingHint = !plan.obs_loaded
          ? '<div class="mini">Se están cargando observaciones de esta planeación...</div>'
          : '';
        const localState = getPlanLocalSaveState(plan);
        const isOpenSaveReady = isOpenPlanReadyForSave(plan, entry);
        const isOpenSaveBusy = localState === 'saving';
        const isOpenSaveSilentlySaving = localState === 'saving_silent';
        const isOpenSaveSaved = localState === 'saved';
        const isOpenSavePreparing = !isOpenSaveReady && !isOpenSaveBusy;
        const saveButtonText = isOpenSaveBusy ? 'Guardando...' : ((isOpenSaveSaved || isOpenSaveSilentlySaving) ? 'Guardado' : (isOpenSavePreparing ? 'Preparando...' : 'Guardar cambios'));
        const saveButtonClass = 'btn-primary plan-save-btn' + (isOpenSaveBusy ? ' is-syncing' : '') + (isOpenSavePreparing ? ' is-preparing' : '') + ((isOpenSaveSaved || isOpenSaveSilentlySaving) ? ' is-saved' : '');
        const saveButtonBusyAttrs = (isOpenSaveBusy || isOpenSavePreparing || isOpenSaveSaved || isOpenSaveSilentlySaving) ? ' disabled aria-disabled="true"' + (isOpenSaveBusy || isOpenSavePreparing || isOpenSaveSilentlySaving ? ' aria-busy="true"' : '') : '';
        const actionStatusHtml = getPlanActionStatusMarkup(plan);
        const buttons = [];
        if (plan.estado === 'borrador' && !isPlaneacionLocalSavePending(plan)) {
          buttons.push('<button class="btn-primary" type="button" onclick="planAction(this, \'' + escapeJsAttrValue(plan.planeacion_id) + '\', \'activarPlaneacion\')">Activar</button>');
        }
        if (plan.estado === 'borrador_pendiente_aprobacion' && hasAdminPower) {
          buttons.push('<button class="btn-primary" type="button" onclick="approvePlan(this, \'' + escapeJsAttrValue(plan.planeacion_id) + '\')">Aprobar</button>');
          buttons.push('<button class="btn-secondary" type="button" onclick="rejectPlan(this, \'' + escapeJsAttrValue(plan.planeacion_id) + '\')">Rechazar</button>');
        }
        if (plan.estado === 'rechazada') {
          buttons.push('<button class="btn-secondary" type="button" onclick="resubmitPlan(this, \'' + escapeJsAttrValue(plan.planeacion_id) + '\')">Reenviar aprobación</button>');
        }
        if (allowClose) {
          buttons.push('<button class="btn-accent" type="button" onclick="confirmClosePlan(this, \'' + escapeJsAttrValue(plan.planeacion_id) + '\')">Cerrar semana</button>');
        }
        if (plan.estado === 'cerrada' && hasAdminPower) {
          buttons.push('<button class="btn-ghost" type="button" onclick="planAction(this, \'' + escapeJsAttrValue(plan.planeacion_id) + '\', \'archivarPlaneacion\')">Archivar</button>');
        }

        if (!isOpen) {
          const isPendingCreation = isPlaneacionPendingCreation(plan);
          const localPending = isPlaneacionLocalSavePending(plan);
          const openIntentAttrs = buildOpenPlanPrefetchIntentAttrs(plan.planeacion_id);
          const openButtonHtml = isPendingCreation
            ? '<button class="btn-open-plan" type="button" disabled aria-disabled="true">Guardando</button>'
            : '<button class="btn-open-plan" type="button"' + openIntentAttrs + ' onclick="togglePlanOpen(this, \'' + escapeJsAttrValue(plan.planeacion_id) + '\')">Abrir</button>';
          const quickActivateButton = !localPending && plan.estado === 'borrador'
            ? '<button class="btn-primary" type="button" onclick="planAction(this, \'' + escapeJsAttrValue(plan.planeacion_id) + '\', \'activarPlaneacion\')">Activar</button>'
            : '';
          return (
            '<article id="plan-card-' + escapeHtml(plan.planeacion_id) + '" class="plan-card is-collapsed plan-card-compact">' +
              '<div class="plan-collapsed-mobile">' +
                '<div class="plan-top">' +
                  '<div>' +
                    '<h3>' + escapeHtml(materiaLabel) + '</h3>' +
                    '<div class="subtle">' + escapeHtml(groupLabel) +
                    ' · ' + escapeHtml(weekLabel) + '</div>' +
                  '</div>' +
                  badgeHtml +
                '</div>' +
                '<div class="meta-grid">' +
                  '<div><strong>Frase:</strong> ' + escapeHtml(plan.frase_semana || '-') + '</div>' +
                  '<div><strong>Resumen:</strong> ' + alumnosResumenText + ' · ' + escapeHtml(String(actividadesCount)) + ' actividad(es)</div>' +
                '</div>' +
                localFeedbackHtml +
                (hasMaterialAlert ? '<div class="plan-alert-chip">Material pendiente</div>' : '') +
                materialHistoryHtml +
                '<div class="actions" style="margin-top:14px;">' +
                  quickActivateButton +
                  openButtonHtml +
                '</div>' +
              '</div>' +
              '<div class="plan-collapsed-desktop">' +
                '<div class="plan-compact-grid">' +
                  '<div class="plan-compact-cell plan-compact-cell-date">' +
                    '<span class="plan-compact-label">Fecha</span>' +
                    '<span class="plan-compact-primary plan-compact-truncate">' + escapeHtml(weekPrimaryLabel) + '</span>' +
                    (weekSecondaryLabel ? '<span class="plan-compact-secondary plan-compact-truncate">' + escapeHtml(weekSecondaryLabel) + '</span>' : '') +
                  '</div>' +
                  '<div class="plan-compact-cell plan-compact-cell-group">' +
                    '<span class="plan-compact-label">Grupo</span>' +
                    '<span class="plan-compact-primary plan-compact-truncate">' + escapeHtml(groupLabel) + '</span>' +
                    (entry.isMulti ? '<span class="mini">' + escapeHtml(String((entry.plans || []).length)) + ' grupos</span>' : '') +
                  '</div>' +
                  '<div class="plan-compact-cell plan-compact-cell-materia">' +
                    '<span class="plan-compact-label">Materia</span>' +
                    '<span class="plan-compact-primary plan-compact-truncate">' + escapeHtml(materiaLabel) + '</span>' +
                  '</div>' +
                  '<div class="plan-compact-cell plan-compact-cell-summary">' +
                    '<span class="plan-compact-label">Resumen</span>' +
                    '<span class="plan-compact-secondary plan-compact-truncate">' + alumnosResumenText + ' · ' + escapeHtml(String(actividadesCount)) + ' actividad(es)</span>' +
                    summaryMetaHtml +
                    localFeedbackHtml +
                  '</div>' +
                  '<div class="plan-compact-cell plan-compact-status plan-compact-cell-status">' +
                    '<span class="plan-compact-label">Estado</span>' +
                    badgeHtml +
                  '</div>' +
                  '<div class="plan-compact-cell plan-compact-actions plan-compact-cell-actions">' +
              quickActivateButton +
              openButtonHtml +
                  '</div>' +
                  '<div class="plan-compact-cell plan-compact-cell-phrase">' +
                    '<span class="plan-compact-label">Frase</span>' +
                    '<span class="plan-compact-phrase-chip">Frase de la semana:</span>' +
                    '<span class="' + phraseCompactClass.replace('plan-compact-secondary', 'plan-compact-phrase-copy') + '"' + phraseCompactAttrs + '>' + escapeHtml(phraseText) + '</span>' +
                  '</div>' +
                '</div>' +
              '</div>' +
            '</article>'
          );
        }

        if (!plan.detail_loaded && plan.boot_detail_loaded) {
          const previewSharedHtml = entry.isMulti
            ? (
                '<div class="plan-multigroup-switcher">' +
                  '<div class="plan-multigroup-switcher-list">' +
                    (entry.plans || []).map((groupPlan) => {
                      const groupRow = getGrupoById(groupPlan.grupo_id);
                      const groupText = groupRow ? getGrupoDisplayName(groupRow) : groupPlan.grupo_id;
                      const activeClass = groupPlan.planeacion_id === plan.planeacion_id ? ' is-active' : '';
                      return '<button class="btn-ghost plan-multigroup-switch' + activeClass + '" type="button" onclick="switchMultiGroupPlan(\'' + escapeJsAttrValue(groupPlan.planeacion_id) + '\')">' + escapeHtml(groupText) + '</button>';
                    }).join('') +
                  '</div>' +
                '</div>'
              )
            : '';
          return (
            '<article id="plan-card-' + escapeHtml(plan.planeacion_id) + '" class="plan-card">' +
              '<div class="plan-top">' +
                '<div>' +
                  '<h3>' + escapeHtml(materiaLabel) + '</h3>' +
                  '<div class="subtle">' + escapeHtml(groupLabel) +
                  ' · ' + escapeHtml(weekLabel) + '</div>' +
                '</div>' +
                badgeHtml +
              '</div>' +
              '<div class="meta-grid">' +
                '<div><strong>Frase:</strong> ' + escapeHtml(plan.frase_semana || '-') + '</div>' +
                '<div><strong>Alumnos:</strong> ' + escapeHtml(String(alumnosCount)) + ' · <strong>Actividades:</strong> ' + escapeHtml(String(actividadesCount)) + (entry.isMulti ? ' · <strong>Grupos:</strong> ' + escapeHtml(String((entry.plans || []).length)) : '') + '</div>' +
              '</div>' +
              localFeedbackHtml +
              previewSharedHtml +
              '<div class="plan-loading-note is-compact">' +
                '<strong>Abriendo planeación...</strong>' +
                '<div class="mini">Estamos preparando alumnos y actividades para que abras con contexto operativo.</div>' +
                '<div class="plan-loading-progress" aria-hidden="true"></div>' +
                '<div class="plan-loading-pill-row">' +
                  '<span class="plan-loading-pill">Alumnos</span>' +
                  '<span class="plan-loading-pill">Actividades</span>' +
                '</div>' +
              '</div>' +
              '<div class="actions" style="margin-top:14px;">' +
                '<button class="btn-open-plan" type="button" onclick="togglePlanOpen(this, \'' + escapeJsAttrValue(plan.planeacion_id) + '\')">Ocultar</button>' +
              '</div>' +
            '</article>'
          );
        }

        if (!plan.detail_loaded) {
          return (
            '<article id="plan-card-' + escapeHtml(plan.planeacion_id) + '" class="plan-card">' +
              '<div class="plan-top">' +
                '<div>' +
                  '<h3>' + escapeHtml(materiaLabel) + '</h3>' +
                  '<div class="subtle">' + escapeHtml(groupLabel) +
                  ' · ' + escapeHtml(weekLabel) + '</div>' +
                '</div>' +
                badgeHtml +
              '</div>' +
              '<div class="meta-grid">' +
                '<div><strong>Frase:</strong> ' + escapeHtml(plan.frase_semana || '-') + '</div>' +
                '<div><strong>Alumnos:</strong> ' + escapeHtml(String(alumnosCount)) + ' · <strong>Actividades:</strong> ' + escapeHtml(String(actividadesCount)) + (entry.isMulti ? ' · <strong>Grupos:</strong> ' + escapeHtml(String((entry.plans || []).length)) : '') + '</div>' +
              '</div>' +
              localFeedbackHtml +
              '<div class="plan-loading-note">' +
                '<strong>Abriendo planeación...</strong>' +
                '<div class="mini">Se están cargando alumnos y actividades para que puedas empezar a revisar de inmediato.</div>' +
                '<div class="plan-loading-progress" aria-hidden="true"></div>' +
                '<div class="plan-loading-pill-row">' +
                  '<span class="plan-loading-pill">Alumnos</span>' +
                  '<span class="plan-loading-pill">Actividades</span>' +
                '</div>' +
              '</div>' +
            '</article>'
          );
        }

        return (
          '<article id="plan-card-' + escapeHtml(plan.planeacion_id) + '" class="plan-card">' +
              '<div class="plan-top">' +
                '<div>' +
                  '<h3>' + escapeHtml(materiaLabel) + '</h3>' +
                  '<div class="subtle">' + escapeHtml(groupLabel) +
                  ' · ' + escapeHtml(weekLabel) + '</div>' +
                '</div>' +
              badgeHtml +
            '</div>' +
            '<div class="meta-grid">' +
              '<div><strong>Frase:</strong> ' + escapeHtml(plan.frase_semana || '-') + '</div>' +
              '<div><strong>Alumnos:</strong> ' + escapeHtml(String(alumnosCount)) + ' · <strong>Actividades:</strong> ' + escapeHtml(String(actividadesCount)) + (entry.isMulti ? ' · <strong>Grupos:</strong> ' + escapeHtml(String((entry.plans || []).length)) : '') + '</div>' +
            '</div>' +
            localFeedbackHtml +
            (plan.estado === 'borrador'
              ? '<div class="plan-quick-actions"><button class="btn-primary" type="button" onclick="planAction(this, \'' + escapeJsAttrValue(plan.planeacion_id) + '\', \'activarPlaneacion\')">Activar planeación</button></div>'
              : '') +
            (hasMaterialAlert
              ? (
                  '<div class="plan-alert-bar">' +
                    '<div class="plan-alert-chip">Material pendiente</div>' +
                    (allowStructureEdit
                      ? '<button class="btn-primary plan-alert-action" type="button" onclick="markPlanMaterialReady(this, \'' + escapeJsAttrValue(plan.planeacion_id) + '\')">Marcar material listo</button>'
                      : '') +
                  '</div>'
                )
              : '') +
            materialHistoryHtml +
            (entry.isMulti && allowStructureEdit ? renderMultiGroupSharedEditor(entry) : '') +
            (entry.isMulti
              ? (
                  '<div class="plan-multigroup-switcher">' +
                    '<div class="plan-multigroup-switcher-list">' +
                      (entry.plans || []).map((groupPlan) => {
                        const groupRow = getGrupoById(groupPlan.grupo_id);
                        const groupText = groupRow ? getGrupoDisplayName(groupRow) : groupPlan.grupo_id;
                        const activeClass = groupPlan.planeacion_id === plan.planeacion_id ? ' is-active' : '';
                        return '<button class="btn-ghost plan-multigroup-switch' + activeClass + '" type="button" onclick="switchMultiGroupPlan(\'' + escapeJsAttrValue(groupPlan.planeacion_id) + '\')">' + escapeHtml(groupText) + '</button>';
                      }).join('') +
                    '</div>' +
                  '</div>'
                )
              : '') +
            (allowStructureEdit
              ? renderOpenPlanStructureEditor(plan, allowStructureEdit, { groupSpecificOnly: entry.isMulti })
              : ('<div class="plan-student-chip-cloud">' + alumnosRows.map((alumnoRow) => {
                    const alumnoDisplay = getAlumnoDisplaySnapshot(alumnoRow);
                    return '<div class="plan-student-chip"><strong>' + escapeHtml(alumnoDisplay.nombre) + '</strong></div>';
                  }).join('') + '</div>' +
                '<div class="stack">' + (actividades || '<span class="mini">Sin actividades capturadas.</span>') + '</div>')) +
            (entry.isMulti && allowStructureEdit ? renderMultiGroupSharedActivities(entry) : '') +
            '<div class="stack">' +
              '<div><strong>Observaciones generales</strong></div>' +
              obsGeneralesHtml +
              '<div class="actions compact">' +
                '<textarea id="obs-general-' + escapeHtml(plan.planeacion_id) + '" placeholder="Agregar observación general para administración"' + (allowGeneralObs ? '' : ' disabled') + '>' + escapeHtml(draftGeneralObservationText || '') + '</textarea>' +
                (allowGeneralObs ? '' : '<span class="mini">Solo administración puede agregar observaciones en semana cerrada.</span>') +
              '</div>' +
            '</div>' +
            '<div class="stack">' +
              '<div><strong>Observación final por alumno' + (entry.isMulti ? ' · todos los grupos' : '') + '</strong></div>' +
              obsAlumnoHtml +
              '<div class="actions obs-final-actions">' +
                (allowAlumnoObs
                  ? ''
                  : '<span class="mini">Solo administración puede editar en semana cerrada.</span>') +
              '</div>' +
            '</div>' +
            '<div class="actions" style="margin-top:14px;">' +
              ((allowStructureEdit || allowGeneralObs || allowAlumnoObs)
                ? '<button id="plan-save-' + escapeHtml(plan.planeacion_id) + '" class="' + saveButtonClass + '" type="button"' + saveButtonBusyAttrs + ' onclick="savePlanChanges(this, \'' + escapeJsAttrValue(plan.planeacion_id) + '\'' + (entry.isMulti ? ', \'' + escapeJsAttrValue(entry.key) + '\'' : '') + ')">' + saveButtonText + '</button>'
                : '') +
              actionStatusHtml +
              '<button class="btn-open-plan" type="button" onclick="togglePlanOpen(this, \'' + escapeJsAttrValue(plan.planeacion_id) + '\')">Ocultar</button>' +
              buttons.join('') +
            '</div>' +
          '</article>'
        );
      }).join('') + loadMoreHtml;
      window.requestAnimationFrame(() => {
        document.querySelectorAll('.obs-final-input').forEach((textarea) => autoGrowObsFinal(textarea));
        if (state.openPlanDraft && state.openPlanDraft.planId) {
          const normalizedPlanId = String(state.openPlanDraft.planId || '').trim();
          const generalInput = $('obs-general-' + normalizedPlanId);
          if (generalInput) {
            const currentPlan = getPlanById(normalizedPlanId);
            generalInput.value = String(state.openPlanDraft.generalObservationText || currentPlan && currentPlan._draft_general_observation_text || '');
          }
          const finalMap = state.openPlanDraft.finalObservationsByKey || {};
          Object.keys(finalMap).forEach((key) => {
            const normalizedKey = String(key || '').trim();
            if (!normalizedKey) return;
            let input = $('obs-final-' + normalizedKey);
            if (!input && normalizedKey.indexOf('::') < 0) {
              input = $('obs-final-' + normalizedPlanId + '-' + normalizedKey);
            }
            if (input) {
              input.value = String(finalMap[key] || '');
              autoGrowObsFinal(input);
            }
          });
        }
      });
    }

    function buildPlaneacionesListSkeleton(count = 3) {
      const desktopHeader =
        '<div class="plan-list-compact-head">' +
          '<span>Fecha</span>' +
          '<span>Grupo</span>' +
          '<span>Materia</span>' +
          '<span>Resumen</span>' +
          '<span>Estado</span>' +
          '<span>Acciones</span>' +
        '</div>';
      const cards = Array.from({ length: count }).map(() => (
        '<article class="plan-card is-collapsed plan-card-compact plan-card-loading">' +
          '<div class="plan-collapsed-mobile">' +
            '<div class="plan-top">' +
              '<div>' +
                '<h3>Cargando planeaci\u00f3n...</h3>' +
                '<div class="subtle">Preparando fecha, grupo y materia</div>' +
              '</div>' +
              '<span class="plan-loading-badge">Cargando</span>' +
            '</div>' +
            '<div class="meta-grid">' +
              '<div><strong>Frase:</strong> Cargando frase de la semana...</div>' +
              '<div><strong>Resumen:</strong> Preparando alumnos y actividades...</div>' +
            '</div>' +
            '<div class="actions" style="margin-top:14px;">' +
              '<button class="plan-loading-btn" type="button" disabled>Cargando...</button>' +
            '</div>' +
          '</div>' +
          '<div class="plan-collapsed-desktop">' +
            '<div class="plan-compact-grid">' +
              '<div class="plan-compact-cell plan-compact-cell-date">' +
                '<span class="plan-compact-label">Fecha</span>' +
                '<span class="plan-loading-line primary">Cargando fecha...</span>' +
                '<span class="plan-loading-line secondary">Semana en preparaci&oacute;n</span>' +
              '</div>' +
              '<div class="plan-compact-cell plan-compact-cell-group">' +
                '<span class="plan-compact-label">Grupo</span>' +
                '<span class="plan-loading-line primary">Cargando grupo...</span>' +
                '<span class="plan-loading-line muted">Esperando datos</span>' +
              '</div>' +
              '<div class="plan-compact-cell plan-compact-cell-materia">' +
                '<span class="plan-compact-label">Materia</span>' +
                '<span class="plan-loading-line primary">Cargando materia...</span>' +
              '</div>' +
              '<div class="plan-compact-cell plan-compact-cell-summary">' +
                '<span class="plan-compact-label">Resumen</span>' +
                '<span class="plan-loading-line secondary">Preparando alumnos y actividades...</span>' +
              '</div>' +
              '<div class="plan-compact-cell plan-compact-status plan-compact-cell-status">' +
                '<span class="plan-compact-label">Estado</span>' +
                '<span class="plan-loading-badge">Cargando</span>' +
              '</div>' +
              '<div class="plan-compact-cell plan-compact-actions plan-compact-cell-actions">' +
                '<button class="plan-loading-btn" type="button" disabled>Cargando...</button>' +
              '</div>' +
              '<div class="plan-compact-cell plan-compact-cell-phrase">' +
                '<span class="plan-compact-label">Frase</span>' +
                '<span class="plan-loading-phrase-chip">Frase de la semana</span>' +
                '<span class="plan-loading-line secondary">Preparando el contenido de la planeaci\u00f3n...</span>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</article>'
      )).join('');
      return '<div class="plan-list-loading-shell">' +
        '<div class="plan-list-loading-copy"><span>Cargando planeaciones...</span></div>' +
        desktopHeader +
        cards +
      '</div>';
    }

    function getPlaneacionesLoadingPreviewCount() {
      const currentRows = Array.isArray(state.planeaciones)
        ? state.planeaciones.filter((plan) => !isPlaneacionPendingCreation(plan))
        : [];
      if (currentRows.length) return Math.max(1, Math.min(currentRows.length, 3));
      if (!canUseAdminShell()) {
        return 0;
      }
      const stats = state.dashboardStats || {};
      const knownCount = Number(
        stats.planeaciones_visibles != null ? stats.planeaciones_visibles : NaN
      );
      if (Number.isFinite(knownCount) && knownCount >= 0) {
        return Math.max(0, Math.min(knownCount, 3));
      }
      return 3;
    }

    function buildPlaneacionesLoadingEmptyState() {
      return '<div class="plan-list-loading-shell">' +
        '<div class="plan-list-loading-copy"><span>Revisando si tienes planeaciones activas...</span></div>' +
        '<div class="empty">Si no tienes planeaciones abiertas, en un momento verás el estado vacío real.</div>' +
      '</div>';
    }

    function getAlertTypeLabel(tipo) {
      return ({
        planeacion_semana_cerrada_aprobacion: 'Aprobaci\u00f3n pendiente',
        planeacion_rechazada: 'Planeaci\u00f3n rechazada',
        material_pendiente: 'Material pendiente',
        material_inicio_semana_pendiente: 'Material pendiente'
      })[String(tipo || '').trim()] || String(tipo || 'Alerta');
    }

    function formatAlertDescription(alerta) {
      const tipo = String((alerta && alerta.tipo_alerta) || '').trim();
      const descripcion = String((alerta && alerta.descripcion) || '').trim();
      if (tipo === 'material_pendiente' && descripcion.indexOf('Material no confirmado en carpetas') === 0) {
        const nombre = descripcion
          .split(new RegExp('\\u2014|' + String.fromCharCode(0x00e2, 0x20ac, 0x201d)))
          .slice(1)
          .join(' - ')
          .trim();
        return nombre
          ? ('Falta confirmar el material en carpetas para ' + nombre)
          : 'Falta confirmar el material en carpetas.';
      }
      return descripcion;
    }

    function getAlertStatusLabel(status) {
      return ({
        abierta: 'Abierta',
        en_revision: 'En revisi\u00f3n',
        resuelta: 'Resuelta'
      })[String(status || '').trim()] || String(status || 'Sin estado');
    }

    function isOperationalAlert(alerta) {
      const tipo = String(alerta && alerta.tipo_alerta || '').trim().toLowerCase();
      return !/(obs|observacion|observaci\u00f3n|nota|seguimiento)/.test(tipo);
    }

    function isOpenMaterialAlert(alerta) {
      const tipo = String((alerta && alerta.tipo_alerta) || '').trim();
      const estado = String((alerta && alerta.estado) || '').trim();
      return ['material_pendiente', 'material_inicio_semana_pendiente'].includes(tipo) && estado !== 'resuelta';
    }

    function isResolvedMaterialAlert(alerta) {
      const tipo = String((alerta && alerta.tipo_alerta) || '').trim();
      const estado = String((alerta && alerta.estado) || '').trim();
      return ['material_pendiente', 'material_inicio_semana_pendiente'].includes(tipo) && estado === 'resuelta';
    }

    function shouldShowMaterialAlertForPlan(plan) {
      if (!plan) return false;
      const role = getCurrentRole();
      const status = String((plan && plan.estado) || '').trim();
      if (role === 'admin' || role === 'directora') return status === 'activa';
      return status === 'borrador' || status === 'activa' || status === 'rechazada';
    }

    function getMaterialAlertPlanDedupeKey(plan) {
      const planId = String((plan && plan.planeacion_id) || '').trim();
      if (!planId) return '';
      const loteId = getPlanLoteId(plan);
      return loteId ? ('material:lote:' + loteId) : ('material:plan:' + planId);
    }

    function getMaterialAlertDedupeKey(alerta) {
      if (!isOpenMaterialAlert(alerta)) return '';
      const planId = String((alerta && alerta.planeacion_id) || '').trim();
      if (!planId) return '';
      return getMaterialAlertPlanDedupeKey(getPlanById(planId) || { planeacion_id: planId });
    }

    function planHasOpenMaterialAlert(planId) {
      const plan = getPlanById(planId);
      if (!shouldShowMaterialAlertForPlan(plan)) return false;
      return state.alertas.some((alerta) => alerta.planeacion_id === planId && isOpenMaterialAlert(alerta));
    }

    function getLatestResolvedMaterialAlertForPlan(planId) {
      const plan = getPlanById(planId);
      if (!shouldShowMaterialAlertForPlan(plan)) return null;
      return state.alertas
        .filter((alerta) => alerta.planeacion_id === planId && isResolvedMaterialAlert(alerta))
        .sort((a, b) => {
          const aDate = new Date(a.fecha_resolucion || a.fecha_actualizacion || a.fecha_creacion || 0).getTime();
          const bDate = new Date(b.fecha_resolucion || b.fecha_actualizacion || b.fecha_creacion || 0).getTime();
          return bDate - aDate;
        })[0] || null;
    }

    function injectLocalMaterialAlerts(plansLike) {
      const plans = Array.isArray(plansLike) ? plansLike : [plansLike];
      if (!Array.isArray(state.alertas)) state.alertas = [];
      const visibleMaterialKeys = new Set(state.alertas
        .map((alerta) => getMaterialAlertDedupeKey(alerta))
        .filter(Boolean));
      let changed = false;
      plans.forEach((planLike) => {
        const plan = planLike && planLike.planeacion_id ? planLike : getPlanById(planLike && planLike.planeacion_id);
        if (!plan || !plan.planeacion_id) return;
        const planId = String(plan.planeacion_id || '').trim();
        if (!planId) return;
        const status = String(plan.estado || '').trim();
        const materialConfirmado = String(plan.material_confirmado || '').trim().toLowerCase() === 'si';
        if (status !== 'activa' || materialConfirmado) return;
        const hasOpenAlert = state.alertas.some((alerta) =>
          String((alerta && alerta.planeacion_id) || '').trim() === planId &&
          isOpenMaterialAlert(alerta)
        );
        if (hasOpenAlert) return;
        const materialKey = getMaterialAlertPlanDedupeKey(plan);
        if (materialKey && visibleMaterialKeys.has(materialKey)) return;
        state.alertas.unshift({
          alerta_id: 'LOCAL-ALT-' + planId,
          planeacion_id: planId,
          tipo_alerta: 'material_pendiente',
          descripcion: 'Falta confirmar el material en carpetas para esta planeación',
          estado: 'abierta',
          fecha_creacion: new Date().toISOString(),
          __local_only: true
        });
        if (materialKey) visibleMaterialKeys.add(materialKey);
        changed = true;
      });
      if (changed) {
        markAlertasFresh();
        persistCurrentBootSnapshot('alertas_local_material');
      }
    }

    function hideOpenMaterialAlertsForPlan(planId) {
      const normalizedPlanId = String(planId || '').trim();
      if (!normalizedPlanId || !Array.isArray(state.alertas)) return false;
      const nextAlertas = state.alertas.filter((alerta) => {
        return !(
          String((alerta && alerta.planeacion_id) || '').trim() === normalizedPlanId &&
          isOpenMaterialAlert(alerta)
        );
      });
      if (nextAlertas.length === state.alertas.length) return false;
      state.alertas = nextAlertas;
      markAlertasFresh();
      persistCurrentBootSnapshot('alertas_material_ready_local');
      return true;
    }

    function getVisibleOperationalAlerts() {
      const materialKeys = new Set();
      return state.alertas.filter((alerta) => {
        const plan = getPlanById(alerta && alerta.planeacion_id);
        if (isOpenMaterialAlert(alerta) && !shouldShowMaterialAlertForPlan(plan)) return false;
        if (isOpenMaterialAlert(alerta)) {
          const materialKey = getMaterialAlertDedupeKey(alerta);
          if (materialKey && materialKeys.has(materialKey)) return false;
          if (materialKey) materialKeys.add(materialKey);
        }
        return isOperationalAlert(alerta) && String((alerta && alerta.estado) || '').trim() !== 'resuelta';
      });
    }

    function openPlanLocalInstant(planId, options = {}) {
      const normalizedPlanId = String(planId || '').trim();
      if (!normalizedPlanId) return null;
      const currentPlan = getPlanById(normalizedPlanId);
      const hasInstantDetail = !!(currentPlan && currentPlan.detail_loaded && hasUsableOpenPlanDetail(currentPlan));
      if (state.ui) state.ui.openPlanLoadingId = hasInstantDetail ? '' : normalizedPlanId;
      state.openPlanId = normalizedPlanId;
      state.openPlanDraft = hasInstantDetail
        ? preserveOpenPlanDraftLocalEdits(normalizedPlanId, buildOpenPlanDraft(currentPlan), currentPlan)
        : null;
      const previewPlan = buildPlaneacionOpenPreviewRow(currentPlan);
      if (previewPlan) upsertPlaneacionRow(previewPlan);
      const refreshedPlan = getPlanById(normalizedPlanId) || currentPlan;
      if (refreshedPlan) {
        const loteId = getPlanLoteId(refreshedPlan);
        if (loteId) setMultiGroupActivePlan(loteId, normalizedPlanId);
      }
      closePlanBuilder();
      if (options.render !== false) renderPlaneacionesList();
      return refreshedPlan;
    }

    async function openPlanFromAlert(button, planId) {
      if (canUseAdminShell()) {
        activateAdminModule('planeaciones');
      } else {
        activateTab('planeaciones');
      }
      openPlanLocalInstant(planId);
      await handleAction('openPlanFromAlert', async () => {
        const detailPromise = ensurePlaneacionDetailLoaded(planId, { silent: true });
        const plan = await detailPromise;
        const entry = getPlaneacionEntryByKey(getPlaneacionEntryKey(plan));
        if (entry && entry.isMulti) {
          ensurePlaneacionEntryDetailsLoaded(entry, { silent: true }).then(() => {
            if (state.openPlanId !== planId) return;
            const refreshedPlan = getPlanById(planId) || plan;
            state.openPlanDraft = refreshedPlan ? preserveOpenPlanDraftLocalEdits(planId, buildOpenPlanDraft(refreshedPlan), refreshedPlan) : null;
            persistCurrentBootSnapshot('planeacion_abierta_alerta_multigrupo');
            renderPlaneacionesList();
          }).catch(() => {});
        }
        if (state.ui) state.ui.openPlanLoadingId = '';
        state.openPlanDraft = plan ? preserveOpenPlanDraftLocalEdits(planId, buildOpenPlanDraft(plan), plan) : null;
        persistCurrentBootSnapshot('planeacion_abierta_alerta');
        renderPlaneacionesList();
        scheduleAfterPaint(() => {
          if (state.openPlanId !== planId) return null;
          return ensurePlaneacionObservacionesLoaded(planId, { silent: true })
            .then(() => {
              if (state.openPlanId !== planId) return;
              renderPlaneacionesList();
            })
            .catch(() => null);
        }, 120);
        scheduleAfterPaint(() => {
          if (state.openPlanId !== planId) return null;
          return ensurePlaneacionesCatalogosAvailable({ render: false, scope: 'editor' })
            .then(() => {
              if (state.openPlanId !== planId) return;
              const refreshedPlan = getPlanById(planId) || plan;
              state.openPlanDraft = refreshedPlan ? preserveOpenPlanDraftLocalEdits(planId, buildOpenPlanDraft(refreshedPlan), refreshedPlan) : null;
              renderPlaneacionesList();
            })
            .catch(() => state.catalogos);
        }, 140);
      }, {
        button,
        key: buildActionKey('openPlanFromAlert', [planId]),
        busyText: 'Abriendo...',
        onError: () => {
          if (state.openPlanId === planId) {
            state.openPlanId = '';
            state.openPlanDraft = null;
          }
          if (state.ui && state.ui.openPlanLoadingId === planId) {
            state.ui.openPlanLoadingId = '';
          }
          renderPlaneacionesList();
          return false;
        }
      });
      renderPlaneacionesList();
      window.requestAnimationFrame(() => {
        const card = $('plan-card-' + planId);
        if (card && typeof card.scrollIntoView === 'function') {
          document.querySelectorAll('.plan-card.is-alert-focus').forEach((item) => {
            item.classList.remove('is-alert-focus');
            if (item._alertFocusTimer) {
              window.clearTimeout(item._alertFocusTimer);
              item._alertFocusTimer = null;
            }
          });
          card.classList.add('is-alert-focus');
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          card._alertFocusTimer = window.setTimeout(() => {
            card.classList.remove('is-alert-focus');
            card._alertFocusTimer = null;
          }, 2200);
        }
      });
    }

    function renderAlertas() {
      const host = $('alertsList');
      const card = $('alertsCard');
      if (!host) return;
      const visibleAlertas = getVisibleOperationalAlerts();
      if (card) {
        const adminMode = canUseAdminShell();
        card.hidden = (adminMode && state.activeAdminModule !== 'dashboard') || !visibleAlertas.length;
      }
      if (!visibleAlertas.length) {
        host.innerHTML = '<div class="empty">Todav&iacute;a no hay alertas visibles para esta sesi&oacute;n.</div>';
        return;
      }

      host.innerHTML = visibleAlertas.map((alerta) => {
        const plan = getPlanById(alerta.planeacion_id);
        const grupo = plan ? getGrupoById(plan.grupo_id) : null;
        const materia = plan ? getMateriaById(plan.materia_id) : null;
        const semana = plan ? state.catalogos.semanas.find((item) => item.semana_id === plan.semana_id) : null;
        const contexto = plan ? [
          grupo ? getGrupoDisplayName(grupo) : '',
          materia ? (materia.nombre || materia.materia_id) : '',
          semana ? (semana.nombre_visible || semana.semana_id) : ''
        ].filter(Boolean).join(' \u00b7 ') : '';
        const metaParts = [];
        if (contexto) metaParts.push(contexto);
        if (alerta.fecha_creacion) metaParts.push('Creada ' + formatFechaHumana(alerta.fecha_creacion));
        return (
          '<div class="alert-item">' +
            '<div class="alert-item-main">' +
              '<div class="alert-item-top">' +
                '<div class="alert-type">' + escapeHtml(getAlertTypeLabel(alerta.tipo_alerta)) + '</div>' +
                '<div class="alert-status ' + escapeHtml(String(alerta.estado || '').trim()) + '">' + escapeHtml(getAlertStatusLabel(alerta.estado)) + '</div>' +
              '</div>' +
              '<div class="alert-summary">' + escapeHtml(formatAlertDescription(alerta)) + '</div>' +
              (metaParts.length ? '<div class="alert-meta">' + escapeHtml(metaParts.join(' \u00b7 ')) + '</div>' : '') +
            '</div>' +
        (plan ? '<div class="alert-item-actions"><button class="btn-open-plan alert-open-btn" type="button"' + buildOpenPlanPrefetchIntentAttrs(plan.planeacion_id) + ' onclick="openPlanFromAlert(this, \'' + escapeJsAttrValue(plan.planeacion_id) + '\')">Abrir</button></div>' : '') +
          '</div>'
        );
      }).join('');
    }

    function safeJsonParse(raw) {
      try {
        return JSON.parse(raw);
      } catch (_) {
        return null;
      }
    }

    function renderAdminReporteCicloModule() {
      const rebuiltTemplate = ensureAdminReporteCicloModuleTemplate();
      if (rebuiltTemplate) bindAdminReporteCicloTemplateEvents();
      const ui = getReportSelectionState();
      const alumnos = state.catalogos.alumnos || [];
      const periodos = getAvailablePeriods();
      const adminAlumno = $('adminReportAlumno');
      const adminPeriodo = $('adminReportPeriodo');
      const selectedAlumno = getSelectedReporteAlumnoRow();
      const selectedPeriodo = getSelectedReportePeriodoRow();

      if (adminAlumno) {
        fillSelect(adminAlumno, alumnos, (row) => row.alumno_id, (row) => getAlumnoSelectLabel(row), 'Selecciona alumno');
        if (ui.alumno_id) adminAlumno.value = ui.alumno_id;
      }
      if (adminPeriodo) {
        fillSelect(adminPeriodo, periodos, (row) => row.id, (row) => row.id + ' - ' + row.name, 'Selecciona per\u00edodo');
        if (ui.periodo_id) adminPeriodo.value = ui.periodo_id;
      }
      if ($('repAlumno') && ui.alumno_id) $('repAlumno').value = ui.alumno_id;
      if ($('repPeriodo') && ui.periodo_id) $('repPeriodo').value = ui.periodo_id;

      if ($('adminReporteKpiAlumnos')) $('adminReporteKpiAlumnos').textContent = String(alumnos.length || 0);
      if ($('adminReporteKpiPeriodos')) $('adminReporteKpiPeriodos').textContent = String(periodos.length || 0);
      if ($('adminReporteKpiPdf')) $('adminReporteKpiPdf').textContent = getReportStatusLabel(ui.lastResult && (ui.lastResult.status || ui.lastResult.estado) || 'sin consulta');

      if ($('adminReportSelectionSummary')) {
        $('adminReportSelectionSummary').innerHTML = [
          '<div class="admin-reporte-ciclo-summary-card"><span>Alumno seleccionado</span><strong>' + escapeHtml(selectedAlumno ? getAlumnoNameLabel(selectedAlumno) : 'Sin selecci\u00f3n') + '</strong></div>',
          '<div class="admin-reporte-ciclo-summary-card"><span>Grupo / matr\u00edcula</span><strong>' + escapeHtml(selectedAlumno ? ((selectedAlumno.grupo_id || '-') + ' - ' + getAlumnoSecondaryLabel(selectedAlumno)) : 'Pendiente') + '</strong></div>',
          '<div class="admin-reporte-ciclo-summary-card"><span>Per\u00edodo</span><strong>' + escapeHtml(selectedPeriodo ? (selectedPeriodo.nombre_visible || selectedPeriodo.periodo_id || '') : 'Sin selecci\u00f3n') + '</strong></div>'
        ].join('');
      }
      if ($('adminReportPreviewAlumno')) {
        $('adminReportPreviewAlumno').textContent = selectedAlumno ? getAlumnoNameLabel(selectedAlumno) : 'Selecciona un alumno';
      }
      if ($('adminReportPreviewMeta')) {
        $('adminReportPreviewMeta').textContent = selectedAlumno
          ? ('Grupo ' + (selectedAlumno.grupo_id || '-') + ' - Matr\u00edcula ' + getAlumnoSecondaryLabel(selectedAlumno) + ' - Documento acad\u00e9mico familiar')
          : 'Grupo, matr\u00edcula y facilitadora se resolver\u00e1n aqu\u00ed.';
      }
      if ($('adminReportPreviewPeriodo')) {
        $('adminReportPreviewPeriodo').textContent = selectedPeriodo ? (selectedPeriodo.nombre_visible || selectedPeriodo.periodo_id || 'Per\u00edodo') : 'Per\u00edodo';
      }

      const adminHost = $('adminReportResult');
      if (adminHost) {
        adminHost.innerHTML = buildReportResultMarkup(ui.lastResult);
      }
      if (!ui.lastResult && $('reportResult')) {
        $('reportResult').innerHTML = buildReportResultMarkup(null, { compact: true });
      }
    }

    function renderReportResult(data) {
      const ui = getReportSelectionState();
      ui.lastResult = data || null;
      const label = getReportStatusLabel(data && (data.status || data.estado) || 'sin consulta');
      const host = $('reportResult');
      if (host) host.innerHTML = buildReportResultMarkup(data, { compact: true });
      const adminHost = $('adminReportResult');
      if (adminHost) adminHost.innerHTML = buildReportResultMarkup(data);
      if ($('adminReporteKpiPdf')) $('adminReporteKpiPdf').textContent = label;
      if ($('adminCountReportes')) $('adminCountReportes').textContent = label;
    }

    async function loadMaintenancePreview(options = {}) {
      if (!canUseAdminShell()) return null;
      const ui = getMaintenanceUi();
      const payload = {
        categories: ui.selectedCategories,
        trash_report_files: !!ui.trashReportFiles
      };
      const data = await api('getEntornoPruebasStatus', payload);
      ui.preview = data.preview || null;
      ui.previewSignature = getMaintenancePreviewSignature();
      ui.lastReset = data.last_reset || null;
      ui.availableCategories = Array.isArray(data.available_categories) ? data.available_categories : [];
      if (!options || !options.keepAudit) {
        ui.audit = ui.audit || null;
      }
      return data;
    }

    function getMaintenancePreviewSignature(categories, trashReportFiles) {
      const ui = getMaintenanceUi();
      const sourceCategories = Array.isArray(categories) ? categories : ui.selectedCategories;
      const normalizedCategories = sourceCategories
        .map((item) => String(item || '').trim())
        .filter(Boolean)
        .sort();
      const trash = typeof trashReportFiles === 'boolean' ? trashReportFiles : !!ui.trashReportFiles;
      return JSON.stringify({
        categories: normalizedCategories,
        trash_report_files: trash
      });
    }

    function isMaintenancePreviewCurrent() {
      const ui = getMaintenanceUi();
      return !!ui.preview && String(ui.previewSignature || '') === getMaintenancePreviewSignature();
    }

    function invalidateMaintenancePreviewIfParamsChanged() {
      const ui = getMaintenanceUi();
      if (!ui.preview) return false;
      if (isMaintenancePreviewCurrent()) return false;
      ui.preview = null;
      ui.previewSignature = '';
      return true;
    }

    function getMaintenanceCategories() {
      const ui = getMaintenanceUi();
      const available = Array.isArray(ui.availableCategories) && ui.availableCategories.length
        ? ui.availableCategories
        : [
            { key: 'planeaciones', label: 'Planeaciones y actividades', description: 'Limpia planeaciones, relaciones y actividades.', default_selected: true },
            { key: 'seguimiento', label: 'Seguimiento, alertas y notas', description: 'Limpia observaciones, alertas y notas.', default_selected: true },
            { key: 'evaluaciones', label: 'Evaluaciones acad\u00e9micas', description: 'Limpia evaluaciones usadas por historial y reporte.', default_selected: true },
            { key: 'reportes', label: 'Cach\u00e9 y artefactos de reportes', description: 'Limpia cach\u00e9 y permite mover PDFs/docs a papelera.', default_selected: true },
            { key: 'comunicacion', label: 'Notificaciones internas', description: 'Limpia avisos y notificaciones.', default_selected: false },
            { key: 'apoyos', label: 'Refuerzos y talleres', description: 'Limpia apoyos operativos sin tocar cat\u00e1logos base.', default_selected: false },
            { key: 'bitacora', label: 'Bit\u00e1cora operativa', description: 'Limpia historial de acciones.', default_selected: false }
          ];
      return available;
    }

    function getMaintenanceSummaryMarkup() {
      const ui = getMaintenanceUi();
      const preview = ui.preview || {};
      const reportFiles = preview.report_files || {};
      return [
        '<div class="admin-config-summary">',
          '<div class="admin-config-stat"><span>Filas objetivo</span><strong>' + escapeHtml(String(preview.total_rows || 0)) + '</strong></div>',
          '<div class="admin-config-stat"><span>Hojas tocadas</span><strong>' + escapeHtml(String((preview.per_sheet || []).length || 0)) + '</strong></div>',
          '<div class="admin-config-stat"><span>Archivos de reporte</span><strong>' + escapeHtml(String((reportFiles.pdf_files || 0) + (reportFiles.doc_files || 0))) + '</strong></div>',
        '</div>'
      ].join('');
    }

    function renderMaintenanceSheetRows() {
      const ui = getMaintenanceUi();
      const rows = ui.preview && Array.isArray(ui.preview.per_sheet) ? ui.preview.per_sheet : [];
      if (!rows.length) {
        return '<div class="admin-alumnos-empty"><div><strong>Sin datos cargados.</strong><div class="subtle">Usa &ldquo;Actualizar vista previa&rdquo; para revisar qu&eacute; se limpiar&iacute;a.</div></div></div>';
      }
      return '<div class="admin-config-sheet-list">' + rows.map((row) => (
        '<div class="admin-config-sheet-row"><strong>' + escapeHtml(row.sheet) + '</strong><span class="mini">' + escapeHtml(String(row.rows || 0)) + ' fila(s)</span></div>'
      )).join('') + '</div>';
    }

    function renderMaintenanceAuditBlock() {
      const ui = getMaintenanceUi();
      const audit = ui.audit || null;
      if (!audit) {
        return '<div class="admin-alumnos-empty"><div><strong>Auditor&iacute;a pendiente.</strong><div class="subtle">Ejecuta la auditor&iacute;a para revisar duplicados, referencias hu&eacute;rfanas y estados inv&aacute;lidos.</div></div></div>';
      }
      const issues = Array.isArray(audit.issues) ? audit.issues : [];
      const warnings = Array.isArray(audit.warnings) ? audit.warnings : [];
      const items = issues.slice(0, 6).concat(warnings.slice(0, 6));
      return [
        '<div class="admin-config-summary">',
          '<div class="admin-config-stat"><span>Problemas</span><strong>' + escapeHtml(String((audit.summary && audit.summary.issues) || issues.length || 0)) + '</strong></div>',
          '<div class="admin-config-stat"><span>Advertencias</span><strong>' + escapeHtml(String((audit.summary && audit.summary.warnings) || warnings.length || 0)) + '</strong></div>',
          '<div class="admin-config-stat"><span>Backend</span><strong>' + escapeHtml(String(audit.backend_version || '-')) + '</strong></div>',
        '</div>',
        items.length
          ? ('<div class="admin-config-audit-list">' + items.map((item) => '<div class="admin-config-audit-item admin-config-note">' + escapeHtml(item) + '</div>').join('') + '</div>')
          : '<div class="admin-note">La auditor&iacute;a no detect&oacute; hallazgos en esta corrida.</div>'
      ].join('');
    }

    function getAdminConfiguracionModuleTemplate() {
      const ui = getMaintenanceUi();
      const categories = getMaintenanceCategories();
      const lastReset = ui.lastReset || null;
      const canReset = canResetTestEnvironment();
      const reportFiles = ui.preview && ui.preview.report_files ? ui.preview.report_files : { pdf_files: 0, doc_files: 0 };
      return [
        '<div class="admin-config-module">',
          '<article class="admin-placeholder">',
            '<div>',
              '<h3>Configuraci&oacute;n y mantenimiento</h3>',
              '<p>Zona t&eacute;cnica para auditar el entorno online de pruebas y limpiar solo datos transaccionales, sin borrar hojas ni headers.</p>',
            '</div>',
            '<div class="admin-config-pills">',
              '<span class="admin-config-pill">Preserva estructura</span>',
              '<span class="admin-config-pill">Preview antes de reset</span>',
              '<span class="admin-config-pill">Auditor&iacute;a final</span>',
            '</div>',
            lastReset
              ? ('<div class="admin-note">&Uacute;ltimo reset registrado: ' + escapeHtml(lastReset.at || '-') + ' por ' + escapeHtml(lastReset.by || '-') + (lastReset.role ? ' (' + escapeHtml(lastReset.role) + ')' : '') + '.</div>')
              : '<div class="admin-note">A&uacute;n no hay un reset t&eacute;cnico registrado en este entorno.</div>',
          '</article>',
          '<div class="admin-config-grid">',
            '<section class="admin-config-card">',
              '<div class="admin-config-card-head"><div><h3>Reset seguro del entorno</h3><div class="subtle">Selecciona qu&eacute; capas operativas quieres limpiar.</div></div></div>',
              '<div class="admin-config-categories">',
                categories.map((item) => (
                  '<label class="admin-config-category">' +
                    '<input type="checkbox" class="admin-config-category-input" data-maintenance-category="' + escapeHtml(item.key) + '"' + (ui.selectedCategories.includes(item.key) ? ' checked' : '') + '>' +
                    '<div><strong>' + escapeHtml(item.label || item.key) + '</strong><div class="subtle">' + escapeHtml(item.description || '') + '</div></div>' +
                  '</label>'
                )).join(''),
              '</div>',
              '<div class="admin-config-inline">',
                '<label class="admin-config-switch"><input id="maintenanceTrashFilesInput" type="checkbox"' + (ui.trashReportFiles ? ' checked' : '') + '> Mandar PDFs/docs de reportes a papelera (' + escapeHtml(String((reportFiles.pdf_files || 0) + (reportFiles.doc_files || 0))) + ' detectados)</label>',
              '</div>',
              getMaintenanceSummaryMarkup(),
              '<div class="actions compact">',
                '<button id="maintenancePreviewBtn" class="btn-secondary" type="button">Actualizar vista previa</button>',
                '<button id="maintenanceAuditBtn" class="btn-ghost" type="button">Ejecutar auditor&iacute;a</button>',
                canReset
                  ? '<button id="maintenanceResetBtn" class="btn-primary" type="button">Resetear entorno de pruebas</button>'
                  : '<button class="btn-primary" type="button" disabled>Reset solo para admin</button>',
              '</div>',
              '<div class="admin-config-danger"><strong>Protecci&oacute;n activa:</strong> este reset solo limpia datos operativos. Cat&aacute;logos maestros, semanas, per&iacute;odos, facilitadores, alumnos, materias, submaterias y configuraci&oacute;n base se conservan.</div>',
            '</section>',
            '<section class="admin-config-card">',
              '<div class="admin-config-card-head"><div><h4>Vista previa</h4><div class="subtle">Conteo por hoja antes de ejecutar el reset.</div></div></div>',
              renderMaintenanceSheetRows(),
              '<div class="admin-config-card-head"><div><h4>Auditor&iacute;a</h4><div class="subtle">Chequeo r&aacute;pido de consistencia estructural y operativa.</div></div></div>',
              renderMaintenanceAuditBlock(),
            '</section>',
          '</div>',
        '</div>'
      ].join('');
    }

    function renderAdminConfiguracionModule() {
      const panel = $('admin-panel-configuracion');
      if (!panel || !canUseAdminShell()) return;
      panel.innerHTML = getAdminConfiguracionModuleTemplate();
      document.querySelectorAll('.admin-config-category-input').forEach((input) => {
        input.addEventListener('change', () => {
          const ui = getMaintenanceUi();
          ui.selectedCategories = Array.from(document.querySelectorAll('.admin-config-category-input:checked')).map((node) => node.dataset.maintenanceCategory);
          invalidateMaintenancePreviewIfParamsChanged();
          renderAdminConfiguracionModule();
        });
      });
      if ($('maintenanceTrashFilesInput')) {
        $('maintenanceTrashFilesInput').addEventListener('change', (event) => {
          const ui = getMaintenanceUi();
          ui.trashReportFiles = !!event.currentTarget.checked;
          invalidateMaintenancePreviewIfParamsChanged();
          renderAdminConfiguracionModule();
        });
      }
      if ($('maintenancePreviewBtn')) {
        $('maintenancePreviewBtn').addEventListener('click', (event) => refreshMaintenancePreview(event.currentTarget));
      }
      if ($('maintenanceAuditBtn')) {
        $('maintenanceAuditBtn').addEventListener('click', (event) => runMaintenanceAudit(event.currentTarget));
      }
      if ($('maintenanceResetBtn')) {
        $('maintenanceResetBtn').addEventListener('click', (event) => resetMaintenanceEnvironment(event.currentTarget));
      }
    }

    async function refreshMaintenancePreview(button) {
      await handleAction('getEntornoPruebasStatus', async () => {
        await loadMaintenancePreview({ keepAudit: true });
        renderAdminConfiguracionModule();
        setBanner('Vista previa del reset actualizada.', 'info');
      }, { button, key: buildActionKey('getEntornoPruebasStatus', [getMaintenanceUi().selectedCategories.join(','), getMaintenanceUi().trashReportFiles ? 'trash' : 'keep']) });
    }

    async function runMaintenanceAudit(button) {
      await handleAction('auditarEntornoPruebas', async () => {
        const audit = await api('auditarEntornoPruebas');
        getMaintenanceUi().audit = audit || null;
        renderAdminConfiguracionModule();
        setBanner(
          ((audit && audit.summary && audit.summary.issues) || 0) > 0
            ? 'Auditor\u00eda completada con hallazgos. Rev\u00edsalos antes del reset.'
            : 'Auditor\u00eda completada sin problemas cr\u00edticos detectados.',
          ((audit && audit.summary && audit.summary.issues) || 0) > 0 ? 'warning' : 'success'
        );
      }, { button, key: 'auditarEntornoPruebas' });
    }

    async function resetMaintenanceEnvironment(button) {
      const uiForActionKey = getMaintenanceUi();
      await handleAction('resetEntornoPruebas', async () => {
        if (!canResetTestEnvironment()) throw new Error('Solo admin puede resetear el entorno de pruebas.');
        const ui = getMaintenanceUi();
        if (!ui.selectedCategories.length) throw new Error('Selecciona al menos una categor\u00eda.');
        if (!isMaintenancePreviewCurrent()) {
          throw new Error('Actualiza la vista previa antes de resetear. La selecci\u00f3n cambi\u00f3.');
        }
        const preview = ui.preview || { total_rows: 0, per_sheet: [] };
        const confirmation = [
          'Se limpiar\u00e1n ' + String(preview.total_rows || 0) + ' filas en ' + String((preview.per_sheet || []).length || 0) + ' hojas.',
          'Categor\u00edas: ' + ui.selectedCategories.join(', ') + '.',
          ui.trashReportFiles ? 'Los PDFs/docs asociados en REPORTES_CACHE tambi\u00e9n se mandar\u00e1n a papelera si existen.' : 'Los archivos f\u00edsicos de reportes se conservar\u00e1n.',
          'La estructura del spreadsheet se mantiene.',
          '\u00bfDeseas continuar?'
        ].join('\n');
        if (!window.confirm(confirmation)) return;
        const data = await api('resetEntornoPruebas', {
          categories: ui.selectedCategories,
          trash_report_files: !!ui.trashReportFiles,
          confirmation_code: 'RESET_ENTORNO_PRUEBAS',
          request_id: uid('RSTENV')
        });
        ui.preview = data.preview_after || null;
        ui.previewSignature = getMaintenancePreviewSignature();
        ui.lastReset = data.last_reset || null;
        ui.audit = data.audit_after || null;
        await refreshAll({ silent: true });
        setBanner('Entorno de pruebas reseteado sin tocar la estructura base.', 'success');
      }, { button, key: buildActionKey('resetEntornoPruebas', [uiForActionKey.selectedCategories.join(','), uiForActionKey.trashReportFiles ? 'trash' : 'keep']) });
    }

    function activateTab(tabName) {
      if (getCurrentRole() === 'facilitador' && tabName !== 'planeaciones') {
        tabName = 'planeaciones';
      }
      if (tabName === 'reportes' && !canUseReportes()) {
        tabName = 'planeaciones';
      }
      if (tabName !== 'planeaciones') {
        resetPlaneacionesTransientUi();
      }
      state.activeTab = tabName;
      document.querySelectorAll('.tab-btn').forEach((btn) => {
        btn.classList.toggle('is-active', btn.dataset.tab === tabName);
      });
      document.querySelectorAll('.panel').forEach((panel) => {
        panel.classList.toggle('is-active', panel.id === 'panel-' + tabName);
      });
      if (tabName === 'planeaciones' && state.ui && !state.ui.planeacionesLoaded) {
        if (shouldSkipPlaneacionesTabBootRefresh()) return;
        refreshPlaneaciones()
          .then(() => renderPlaneacionesSurface({
            includeStats: true,
            includePlaneaciones: true,
            includeAlertas: true
          }))
          .catch(() => {});
      }
    }

    function renderAll() {
      const adminMode = canUseAdminShell();
      const activeTab = state.activeTab;
      const activeAdminModule = state.activeAdminModule;
      const shouldRenderPlaneaciones = adminMode ? activeAdminModule === 'planeaciones' : activeTab === 'planeaciones';
      const shouldRenderSeguimiento = !adminMode && activeTab === 'seguimiento';
      const shouldRenderReportes = adminMode ? activeAdminModule === 'reporte-ciclo' : activeTab === 'reportes';
      const shouldRenderCatalogSelects = shouldRenderPlaneaciones || shouldRenderSeguimiento || shouldRenderReportes;
      const shouldRenderAlerts = !adminMode || activeAdminModule === 'dashboard' || activeAdminModule === 'planeaciones';

      refreshStaticCopy();
      syncAuthMode();
      renderSession();
      renderStats();
      renderAdminShell();
      if (adminMode) renderActiveAdminModule(activeAdminModule);
      renderInstitutionalNotices();
      if (shouldRenderCatalogSelects) {
        if (shouldRenderReportes) renderPeriodSelects();
        renderBaseSelects({
          planeaciones: shouldRenderPlaneaciones,
          seguimiento: shouldRenderSeguimiento,
          reportes: shouldRenderReportes
        });
      }
      if (shouldRenderSeguimiento) {
        renderObsAlumnoSelect();
        renderEvaluationDependencies();
      }
      if (shouldRenderPlaneaciones) {
        renderPlaneacionesList();
        renderPlanBuilderVisibility();
        scheduleVisiblePlaneacionDetailPrefetch();
      }
      if (shouldRenderAlerts) renderAlertas();
      syncRoleUi();
      activateTab(state.activeTab);
    }

    function renderBootSurface() {
      refreshStaticCopy();
      syncAuthMode();
      renderSession();
      renderStats();
      renderAdminShell();
      renderInstitutionalNotices();
      if (canUseAdminShell()) {
        if (state.activeAdminModule === 'dashboard') {
          renderAlertas();
        } else {
          renderActiveAdminModule(state.activeAdminModule);
        }
      } else if (String(state.activeTab || '').trim() === 'planeaciones') {
        renderBaseSelects({ planeaciones: true });
        renderPlaneacionesList();
        renderPlanBuilderVisibility();
        scheduleVisiblePlaneacionDetailPrefetch();
      }
      syncRoleUi();
      activateTab(state.activeTab);
    }

    async function savePlanEditor(targetStatusOverride) {
      ensureLoggedIn();
      if (state.ui && state.ui.planeacionesCatalogosLoading) {
        throw new Error('Espera a que terminen de cargar materias y grupos.');
      }
      clearPlanEditorValidation();
      const hasAdminPower = canUseAdminShell();
      const editorMode = state.planEditor.mode;
      const fallbackDate = editorMode === 'edit'
        ? getWeekStartDateById(state.planEditor.lockedSemanaId)
        : '';
      const fechaPlaneacion = $('planFecha').value || fallbackDate;
      const previousPlan = editorMode === 'edit' ? getPlanById(state.planEditor.planId) : null;
      const semana = editorMode === 'edit'
        ? resolveWeekForPlanDate(previousPlan, fechaPlaneacion)
        : getPlanEditorWeekByDateOrDraft(fechaPlaneacion);
      if (!semana) throw createPlanEditorValidationError('Selecciona una fecha valida para construir la semana.', 'planFecha');
      const materiaId = String($('planMateria').value || '').trim();
      const fraseSemana = $('planFrase').value.trim();
      if (!materiaId) throw createPlanEditorValidationError('Selecciona una materia.', 'planMateria');
      const selectedSubmateriaId = getPlanEditorSelectedSubmateriaId(materiaId);
      if (materiaRequiresPlanSubmateria(materiaId) && !selectedSubmateriaId) {
        throw createPlanEditorValidationError('Selecciona una submateria.', 'planSubmateria');
      }
      if (getPlanEditorUsesTallerSelector(materiaId) && !getSelectedPlanTallerId()) {
        throw createPlanEditorValidationError('Selecciona un taller.', 'planSubmateria');
      }
      const grupoIds = state.planEditor.mode === 'edit'
        ? (hasAdminPower ? getSelectedGroupIds() : [state.planEditor.lockedGrupoId])
        : getSelectedGroupIds();
      if (!grupoIds.length) throw createPlanEditorValidationError('Selecciona al menos un grupo.', 'planGruposChecklist');
      if (editorMode === 'edit' && hasAdminPower && grupoIds.length !== 1) {
        throw createPlanEditorValidationError('Administracion debe seleccionar exactamente un grupo al editar una planeacion.', 'planGruposChecklist');
      }
      const alumnosIds = getSelectedPlanAlumnos();
      if (!alumnosIds.length) throw createPlanEditorValidationError('Selecciona al menos un alumno.', 'planAlumnosChecklist');
      const includeSeguimientoOnEditor = canUseAdminShell() && editorMode === 'edit';
      const usePlaneacionOutboxFeedback = !hasAdminPower && isPlaneacionOutboxEnabled();
      const actividades = state.planEditor.activities
        .map((activity) => ({
          actividad_id: activity.actividad_id || '',
          texto: String(activity.texto || '').trim(),
          material_en_carpeta: activity.material_en_carpeta || 'no_requiere',
          realizada: includeSeguimientoOnEditor ? (activity.realizada || '') : '',
          comentario_cierre: includeSeguimientoOnEditor ? String(activity.comentario_cierre || '').trim() : '',
          last_known_updated_at: activity.last_known_updated_at || ''
        }))
        .filter((activity) => activity.texto);
      if (!actividades.length) throw createPlanEditorValidationError('Captura al menos una actividad.', 'planActivitiesList');
      if (includeSeguimientoOnEditor) {
        actividades.forEach((activity, index) => {
          if (activity.realizada === 'no' && !activity.comentario_cierre) {
            throw createPlanEditorValidationError('La actividad ' + (index + 1) + ' necesita comentario porque no se realizo.', 'planActivitiesList');
          }
        });
      }

      const selectedTallerIdForSave = getPlanEditorUsesTallerSelector(materiaId)
        ? getSelectedPlanTallerId()
        : String((previousPlan && previousPlan.taller_id) || '').trim();
      const planEditorSnapshot = capturePlanEditorSnapshot();
      const targetStatus = editorMode === 'edit'
        ? String((previousPlan && previousPlan.estado) || 'borrador').trim()
        : (String(targetStatusOverride || '').trim() === 'activa' ? 'activa' : 'borrador');
      const optimisticCreatedPlans = editorMode !== 'edit'
        ? buildOptimisticCreatedPlaneaciones({
            fechaPlaneacion,
            semana,
            groupIds: grupoIds,
            materiaId,
            submateriaId: selectedSubmateriaId,
            tallerId: selectedTallerIdForSave,
            fraseSemana,
            alumnosIds,
            activities: actividades,
            targetStatus
          })
        : [];
      const shouldForceAlertasAfterSave = actividades.some((activity) => normalizeMaterialStatus(activity.material_en_carpeta) === 'no_listo');
      const optimisticUpdatedPlan = editorMode === 'edit' && previousPlan
        ? buildOptimisticPlaneacionSavePreview(previousPlan, {
            draft: {
              fecha_planeacion: fechaPlaneacion,
              frase_semana: fraseSemana,
              materia_id: materiaId,
              submateria_id: selectedSubmateriaId,
              taller_id: selectedTallerIdForSave,
              alumnos_ids: alumnosIds,
              activities: actividades.map((activity) => ({
                actividad_id: activity.actividad_id || '',
                texto: activity.texto,
                material_en_carpeta: activity.material_en_carpeta,
                realizada: activity.realizada,
                comentario_cierre: activity.comentario_cierre,
                last_known_updated_at: activity.last_known_updated_at || ''
              })),
              lastKnownUpdatedAt: state.planEditor.lastKnownUpdatedAt,
              lastKnownActivitiesVersion: state.planEditor.lastKnownActivitiesVersion
            },
            request: {
              semana,
              fallbackDate,
              materiaId,
              submateriaId: selectedSubmateriaId,
              tallerId: selectedTallerIdForSave,
              alumnosIds,
              actividades
            },
            localState: 'saving',
            localMessage: usePlaneacionOutboxFeedback
              ? 'Guardado local. Sincronizando...'
              : 'Guardando en segundo plano...'
          })
        : null;
      const optimisticCreatedIds = optimisticCreatedPlans.map((plan) => plan.planeacion_id);
      if (usePlaneacionOutboxFeedback && optimisticCreatedPlans.length) {
        optimisticCreatedPlans.forEach((plan) => {
          plan._local_save_message = 'Guardada localmente. Sincronizando creación...';
        });
      }
      const shouldRollbackCreate = optimisticCreatedIds.length > 0;
      if (optimisticUpdatedPlan) {
        upsertPlaneacionRow(optimisticUpdatedPlan);
        state.openPlanId = optimisticUpdatedPlan.planeacion_id;
        state.openPlanDraft = buildOpenPlanDraft(optimisticUpdatedPlan);
        persistCurrentBootSnapshot('planeacion_editor_guardando');
        renderPlaneacionesSurface({
          includeStats: true,
          includePlaneaciones: true,
          includeAlertas: false
        });
      } else if (optimisticCreatedPlans.length) {
        upsertPlaneacionesRows(optimisticCreatedPlans);
        resetPlanEditor();
        state.openPlanId = '';
        state.openPlanDraft = null;
        persistCurrentBootSnapshot('planeacion_editor_creando');
        focusPlaneacionCardSoon(optimisticCreatedIds[0]);
        renderPlaneacionesSurface({
          includeStats: true,
          includePlaneaciones: true,
          includeAlertas: false
        });
      }
      if (!hasAdminPower && isPlaneacionOutboxEnabled()) {
        if (editorMode === 'edit' && optimisticUpdatedPlan) {
          enqueuePlaneacionOutboxItem(buildPlaneacionOutboxItem('editor_edit', {
            mergeKey: 'plan:' + String(state.planEditor.planId || '').trim(),
            planId: String(state.planEditor.planId || '').trim(),
            previousPlanSnapshot: previousPlan,
            optimisticPlan: optimisticUpdatedPlan,
            forceAlertas: shouldForceAlertasAfterSave,
            localMessage: 'Guardado local. Sincronizando...',
            requestAction: 'guardarPlaneacionCompleta',
            requestPayload: {
              planeacion_id: state.planEditor.planId,
              fecha_planeacion: fechaPlaneacion,
              semana_id: semana.draft ? '' : semana.semana_id,
              grupo_id: grupoIds[0],
              materia_id: materiaId,
              submateria_id: selectedSubmateriaId,
              taller_id: selectedTallerIdForSave,
              frase_semana: fraseSemana,
              alumnos_ids: alumnosIds,
              actividades,
              last_known_updated_at: state.planEditor.lastKnownUpdatedAt,
              last_known_activities_version: state.planEditor.lastKnownActivitiesVersion,
              request_id: uid('PLAUPD')
            }
          }));
          return;
        }
        if (editorMode !== 'edit' && optimisticCreatedPlans.length) {
          enqueuePlaneacionOutboxItem(buildPlaneacionOutboxItem('editor_create', {
            tempPlanIds: optimisticCreatedIds,
            optimisticPlans: optimisticCreatedPlans,
            planEditorSnapshot,
            forceAlertas: shouldForceAlertasAfterSave,
            localMessage: 'Guardada localmente. Sincronizando creación...',
            requestAction: 'crearPlaneacion',
            requestPayload: {
              fecha_planeacion: fechaPlaneacion,
              semana_id: semana.draft ? '' : semana.semana_id,
              grupo_ids: grupoIds,
              estado_inicial: targetStatus,
              materia_id: materiaId,
              submateria_id: selectedSubmateriaId,
              taller_id: selectedTallerIdForSave,
              frase_semana: fraseSemana,
              alumnos_ids: alumnosIds,
              actividades,
              request_id: uid('PLA')
            }
          }));
          return;
        }
      }
      let responseData = null;
      try {
        if (editorMode === 'edit') {
          responseData = await api('guardarPlaneacionCompleta', {
            planeacion_id: state.planEditor.planId,
            fecha_planeacion: fechaPlaneacion,
            semana_id: semana.draft ? '' : semana.semana_id,
            grupo_id: grupoIds[0],
            materia_id: materiaId,
            submateria_id: selectedSubmateriaId,
            taller_id: selectedTallerIdForSave,
            frase_semana: fraseSemana,
            alumnos_ids: alumnosIds,
            actividades,
            last_known_updated_at: state.planEditor.lastKnownUpdatedAt,
            last_known_activities_version: state.planEditor.lastKnownActivitiesVersion,
            request_id: uid('PLAUPD')
          });
        } else {
          responseData = await api('crearPlaneacion', {
            fecha_planeacion: fechaPlaneacion,
            semana_id: semana.draft ? '' : semana.semana_id,
            grupo_ids: grupoIds,
            estado_inicial: targetStatus,
            materia_id: materiaId,
            submateria_id: selectedSubmateriaId,
            taller_id: selectedTallerIdForSave,
            frase_semana: fraseSemana,
            alumnos_ids: alumnosIds,
            actividades,
            request_id: uid('PLA')
          });
        }
      } catch (err) {
        if (optimisticUpdatedPlan && previousPlan) {
          upsertPlaneacionRow(previousPlan);
          state.openPlanId = previousPlan.planeacion_id;
          state.openPlanDraft = buildOpenPlanDraft(previousPlan);
          renderPlaneacionesSurface({
            includeStats: true,
            includePlaneaciones: true,
            includeAlertas: false
          });
        }
        if (shouldRollbackCreate) {
          removePlaneacionRows(optimisticCreatedIds);
          restorePlanEditorFromSnapshot(planEditorSnapshot);
          renderPlaneacionesSurface({
            includeStats: true,
            includePlaneaciones: true,
            includeAlertas: false
          });
        }
        throw err;
      }
      const updatedPlan = responseData && responseData.planeacion ? responseData.planeacion : null;
      const createdPlans = Array.isArray(responseData && responseData.planeaciones)
        ? responseData.planeaciones.filter((plan) => plan && plan.planeacion_id)
        : (updatedPlan && updatedPlan.planeacion_id ? [updatedPlan] : []);
      const canApplyLocally = editorMode === 'edit' && updatedPlan && !shouldRefetchPlaneacionesAfterPlanSave(previousPlan, updatedPlan);
      const canApplyCreateLocally = editorMode !== 'edit' && createdPlans.length;
      if (editorMode !== 'edit' && !optimisticCreatedPlans.length) {
        resetPlanEditor();
      }
      if (optimisticCreatedIds.length) removePlaneacionRows(optimisticCreatedIds);
      if (canApplyLocally) {
        upsertPlaneacionRow(Object.assign({}, updatedPlan, {
          _local_save_state: 'saved',
          _local_save_message: 'Planeación guardada.'
        }));
        state.openPlanId = updatedPlan.planeacion_id;
        state.openPlanDraft = buildOpenPlanDraft(getPlanById(updatedPlan.planeacion_id) || updatedPlan);
        renderPlaneacionesSurface({
          includeStats: true,
          includePlaneaciones: true,
          includeAlertas: false
        });
        persistCurrentBootSnapshot('planeacion_editor_guardada');
        scheduleClearLocalPlaneacionFeedback(updatedPlan.planeacion_id);
        refreshPlaneacionesAlertsDeferred({
          force: shouldForceAlertasAfterSave
        });
      } else if (canApplyCreateLocally) {
        const appliedPlans = upsertPlaneacionesRows(createdPlans.map((plan) => Object.assign({}, plan, {
          _local_save_state: 'saved',
          _local_save_message: 'Planeación creada.'
        })));
        if (shouldForceAlertasAfterSave) injectLocalMaterialAlerts(appliedPlans);
        renderPlaneacionesSurface({
          includeStats: true,
          includePlaneaciones: true,
          includeAlertas: false
        });
        persistCurrentBootSnapshot('planeacion_editor_creada');
        scheduleClearLocalPlaneacionFeedback(appliedPlans.map((plan) => plan.planeacion_id));
        refreshPlaneacionesAlertsDeferred({
          force: shouldForceAlertasAfterSave
        });
      } else {
        await refreshPlaneacionesSurface({ includeAlertas: false });
        refreshPlaneacionesAlertsDeferred({
          force: shouldForceAlertasAfterSave,
          includeStats: false,
          includePlaneaciones: false
        }).catch(() => {});
      }
      setBanner(
        responseData && responseData._meta && responseData._meta.message
          ? responseData._meta.message
          : (editorMode === 'edit' ? 'Planeación actualizada.' : 'Planeación guardada.'),
        'success'
      );
    }

    async function saveObservation() {
      ensureLoggedIn();
      ensureBackendPeriodsReady();
      if (!$('obsPlan').value) throw new Error('Selecciona una planeaci\u00f3n.');
      if (!$('obsAlumno').value) throw new Error('Selecciona un alumno.');
      if (!$('obsPeriodo').value) throw new Error('Selecciona un per\u00edodo.');
      if (!$('obsNota').value.trim()) throw new Error('Escribe la observaci\u00f3n.');
      await api('crearObsAlumno', {
        planeacion_id: $('obsPlan').value,
        alumno_id: $('obsAlumno').value,
        tipo: $('obsTipo').value,
        nota: $('obsNota').value.trim(),
        fecha: $('obsFecha').value,
        visible_en_reporte: $('obsVisible').checked ? 'si' : 'no',
        requiere_revision_directora: $('obsRevision').checked ? 'si' : 'no',
        periodo_id: $('obsPeriodo').value,
        request_id: uid('OBS')
      });
      $('obsNota').value = '';
      $('obsRevision').checked = false;
      setBanner('Observaci\u00f3n guardada.', 'success');
    }

    async function saveEvaluation() {
      ensureLoggedIn();
      ensureBackendPeriodsReady();
      if (!$('evaAlumno').value) throw new Error('Selecciona un alumno.');
      if (!$('evaPeriodo').value) throw new Error('Selecciona un per\u00edodo.');
      if (!$('evaMateria').value) throw new Error('Selecciona una materia.');
      const data = await api('guardarEvaluacion', {
        alumno_id: $('evaAlumno').value,
        materia_id: $('evaMateria').value,
        submateria_id: $('evaSubmateria').value,
        habilidad_id: $('evaHabilidad').value,
        nivel: $('evaNivel').value,
        comentario: $('evaComentario').value.trim(),
        visible_en_reporte: $('evaVisible').checked ? 'si' : 'no',
        periodo_id: $('evaPeriodo').value,
        request_id: uid('EVA')
      });
      $('evaComentario').value = '';
      setBanner('Evaluaci\u00f3n guardada (' + data.evaluacion_id + ').', 'success');
    }

    async function saveNote() {
      ensureLoggedIn();
      ensureBackendPeriodsReady();
      if (!$('notaAlumno').value) throw new Error('Selecciona un alumno.');
      if (!$('notaTexto').value.trim()) throw new Error('Escribe el texto de la nota.');
      if ($('notaAlcance').value === 'periodo' && !$('notaPeriodo').value) {
        throw new Error('Selecciona un per\u00edodo para la nota.');
      }
      await api('crearNotaDirectora', {
        alumno_id: $('notaAlumno').value,
        tipo: $('notaTipo').value,
        alcance: $('notaAlcance').value,
        periodo_id: $('notaAlcance').value === 'global' ? '' : $('notaPeriodo').value,
        texto: $('notaTexto').value.trim(),
        visible_en_reporte: $('notaVisible').checked ? 'si' : 'no',
        request_id: uid('NTA')
      });
      $('notaTexto').value = '';
      setBanner('Nota de direcci\u00f3n guardada.', 'success');
    }

    async function generateReportNow() {
      ensureLoggedIn();
      ensureCanUseReportes();
      ensureBackendPeriodsReady();
      const alumnoId = getSelectedReporteAlumnoId();
      const periodoId = getSelectedReportePeriodoId();
      if (!alumnoId) throw new Error('Selecciona un alumno.');
      if (!periodoId) throw new Error('Selecciona un per\u00edodo.');
      const data = await api('requestReporteAlumno', {
        alumno_id: alumnoId,
        periodo_id: periodoId,
        request_id: uid('REP')
      });
      data._selection = { alumno_id: alumnoId, periodo_id: periodoId };
      renderReportResult(data);
      if (data.status === 'listo' && data.url) {
        setBanner('El reporte ya estaba vigente y listo para abrir.', 'success');
        return;
      }
      setBanner('Solicitud registrada. El worker generar\u00e1 o actualizar\u00e1 el reporte en segundo plano.', 'success');
    }

    async function requestReport() {
      ensureLoggedIn();
      ensureCanUseReportes();
      ensureBackendPeriodsReady();
      const alumnoId = getSelectedReporteAlumnoId();
      const periodoId = getSelectedReportePeriodoId();
      if (!alumnoId) throw new Error('Selecciona un alumno.');
      if (!periodoId) throw new Error('Selecciona un per\u00edodo.');
      const data = await api('regenerarReporteAlumno', {
        alumno_id: alumnoId,
        periodo_id: periodoId,
        request_id: uid('RRG')
      });
      data._selection = { alumno_id: alumnoId, periodo_id: periodoId };
      renderReportResult(data);
      if (data.status === 'listo' && data.url) {
        setBanner('Reporte regenerado y listo para abrir.', 'success');
        return;
      }
      setBanner('Regeneraci\u00f3n forzada registrada. El worker armar\u00e1 una nueva versi\u00f3n del PDF.', 'success');
    }

    async function checkReportStatus() {
      ensureLoggedIn();
      ensureCanUseReportes();
      ensureBackendPeriodsReady();
      const alumnoId = getSelectedReporteAlumnoId();
      const periodoId = getSelectedReportePeriodoId();
      if (!alumnoId) throw new Error('Selecciona un alumno.');
      if (!periodoId) throw new Error('Selecciona un per\u00edodo.');
      const data = await api('getReporteAlumnoStatus', {
        alumno_id: alumnoId,
        periodo_id: periodoId
      });
      data._selection = { alumno_id: alumnoId, periodo_id: periodoId };
      renderReportResult(data);
      setBanner('Estado de reporte actualizado.', data.status === 'listo' ? 'success' : 'info');
    }

    async function handleAction(label, fn, options = {}) {
      const actionKey = options.key || label;
      const button = options.button || null;
      const busyText = options.busyText || 'Procesando...';
      const feedbackAnchor = captureFeedbackAnchor(button);
      if (inFlightActions.has(actionKey)) {
        return inFlightActions.get(actionKey);
      }

      // BUG-11: capturar el token con el que arranc\u00f3 la acci\u00f3n para detectar
      // callbacks tard\u00edos de una sesi\u00f3n vieja que llegan despu\u00e9s de un login
      // fresh. Si el token cambi\u00f3 mientras la acci\u00f3n corr\u00eda, ignorar el error
      // de INVALID_SESSION sin tocar la sesi\u00f3n nueva ni mostrar banner stale.
      const actionSessionToken = String((state.session && state.session.token) || '');

      const runner = (async () => {
        pushFeedbackAnchor(feedbackAnchor);
        try {
          clearActionToast();
          setButtonBusy(button, true, busyText);
          await fn();
        } catch (err) {
          if (err && err.code === 'INVALID_SESSION') {
            const currentSessionToken = String((state.session && state.session.token) || '');
            const hasNewerSession = currentSessionToken && currentSessionToken !== actionSessionToken;
            if (hasNewerSession) return;
            clearSessionScopedState();
            setBanner('Tu sesi\u00f3n expir\u00f3 o ya no es v\u00e1lida. Vuelve a iniciar sesi\u00f3n.', 'error', { anchor: feedbackAnchor });
            return;
          }
          if (showPlanEditorValidationError(err)) return;
          if (showInlineFieldValidationError(err)) return;
          const handled = typeof options.onError === 'function'
            ? options.onError(err, { anchor: feedbackAnchor, button })
            : false;
          if (!handled) {
            setBanner(formatApiError(err), 'error', { anchor: feedbackAnchor });
          }
        } finally {
          popFeedbackAnchor();
          inFlightActions.delete(actionKey);
          setButtonBusy(button, false, busyText);
        }
      })();

      inFlightActions.set(actionKey, runner);
      return runner;
    }

    function getActivationStateMismatchMessage(plan) {
      const status = String(plan && plan.estado || '').trim();
      if (status === 'activa') return 'La planeaci\u00f3n ya est\u00e1 activa; actualic\u00e9 la vista.';
      if (status === 'cerrada') return 'Esta planeaci\u00f3n ya est\u00e1 cerrada; actualic\u00e9 la vista.';
      if (status === 'archivada') return 'Esta planeaci\u00f3n ya est\u00e1 archivada; actualic\u00e9 la vista.';
      if (status === 'cierre_pendiente') return 'Esta planeaci\u00f3n est\u00e1 en cierre pendiente; actualic\u00e9 la vista.';
      if (status === 'borrador_pendiente_aprobacion') return 'Esta planeaci\u00f3n qued\u00f3 pendiente de aprobaci\u00f3n; actualic\u00e9 la vista.';
      if (status === 'rechazada') return 'Esta planeaci\u00f3n fue rechazada; actualic\u00e9 la vista.';
      return 'La planeaci\u00f3n cambi\u00f3 de estado; actualic\u00e9 la vista.';
    }

    function isActivationTransitionConflictError(err) {
      const message = String(err && err.message || '').toLowerCase();
      return message.includes('transici') && message.includes('activa');
    }

    async function refreshPlaneacionRowAfterActivationMismatch(planId) {
      const freshPlan = await fetchPlaneacionListRow(planId);
      if (!freshPlan) return null;
      const updated = upsertPlaneacionRow(freshPlan) || freshPlan;
      persistCurrentBootSnapshot('planeacion_activacion_estado_fresco');
      renderPlaneacionesList();
      return updated;
    }

    async function planAction(button, planId, action) {
      await handleAction(action, async () => {
        const shouldCloseOpenCard = action === 'activarPlaneacion' &&
          String(state.openPlanId || '').trim() === String(planId || '').trim();
        let previousPlan = getPlanById(planId);
        if (!previousPlan) throw new Error('Planeación no encontrada.');
        if (isPlaneacionBlockedForActions(previousPlan)) {
          notifyPlaneacionStillSyncing(button);
          return;
        }
        if (action === 'activarPlaneacion') {
          const localState = getPlanLocalSaveState(previousPlan);
          if (localState === 'sync_error') {
            schedulePlaneacionOutboxProcessing(60);
            setBanner('Primero corrige el guardado pendiente antes de activar la semana.', 'info');
            return;
          }
          try {
            const freshPlan = await fetchPlaneacionListRow(planId);
            if (freshPlan) {
              previousPlan = upsertPlaneacionRow(freshPlan) || freshPlan;
              const freshStatus = String(previousPlan.estado || '').trim();
              if (freshStatus && freshStatus !== 'borrador') {
                persistCurrentBootSnapshot('planeacion_activacion_preflight_estado_fresco');
                renderPlaneacionesList();
                setBanner(getActivationStateMismatchMessage(previousPlan), 'info');
                return;
              }
            }
          } catch (_) {}
        }
        const previousPlanSnapshot = previousPlan ? cloneJsonSafe(previousPlan, previousPlan) : null;
        const previousOpenPlanId = state.openPlanId;
        const previousOpenPlanDraft = state.openPlanDraft
          ? cloneJsonSafe(state.openPlanDraft, state.openPlanDraft)
          : null;
        if (action === 'activarPlaneacion' && previousPlan) {
          const optimisticPlan = applyOptimisticPlanPatch(planId, {
            estado: 'activa',
            fecha_actualizacion: String((previousPlan && previousPlan.fecha_actualizacion) || '').trim()
          }, {
            localState: 'activating',
            localMessage: '',
            snapshotKind: 'planeacion_activando_local',
            forceLocalMaterialAlerts: true,
            closeOpenCard: shouldCloseOpenCard
          });
          if (optimisticPlan) focusPlaneacionCardSoon(planId);
        }
        let response = null;
        try {
          response = await api(action, { planeacion_id: planId, request_id: uid('PLAN') });
        } catch (err) {
          if (action === 'activarPlaneacion' && previousPlanSnapshot) {
            upsertPlaneacionRow(previousPlanSnapshot);
            state.openPlanId = previousOpenPlanId;
            state.openPlanDraft = previousOpenPlanDraft;
            persistCurrentBootSnapshot('planeacion_activacion_revertida');
            renderPlaneacionesList();
            if (isActivationTransitionConflictError(err)) {
              try {
                const freshPlan = await refreshPlaneacionRowAfterActivationMismatch(planId);
                if (freshPlan) {
                  setBanner(getActivationStateMismatchMessage(freshPlan), 'info');
                  return;
                }
              } catch (_) {}
            }
          }
          throw err;
        }
        const updatedPlan = response && response.planeacion
          ? Object.assign({}, previousPlan || {}, response.planeacion)
          : null;
        let appliedLocally = false;
        if (action === 'activarPlaneacion' && updatedPlan) {
          applyOptimisticPlanPatch(planId, Object.assign({}, updatedPlan, {
            estado: 'activa',
            fecha_actualizacion: String((updatedPlan && updatedPlan.fecha_actualizacion) || '').trim()
          }), {
            localState: '',
            localMessage: '',
            snapshotKind: 'planeacion_activacion_confirmada',
            forceLocalMaterialAlerts: true,
            closeOpenCard: shouldCloseOpenCard
          });
          refreshPlaneacionesAlertsDeferred({
            force: true,
            includeStats: false,
            includePlaneaciones: false
          }).catch(() => {});
          appliedLocally = true;
        } else {
          appliedLocally = !hasActivePlaneacionesFilters() &&
            await applySavedPlaneacionTransition(planId, updatedPlan, { closeOpenCard: shouldCloseOpenCard });
        }
        if (!appliedLocally) {
          await refreshPlaneacionesSurface();
        }
        setBanner(
          action === 'activarPlaneacion'
            ? 'La planeación ya está activa y lista para trabajarse.'
            : ('Acción completada: ' + action),
          'success'
        );
      }, { button, key: buildActionKey(action, [planId]) });
    }

    async function saveActivityProgress(button, actividadId, lastKnownUpdatedAt) {
      const realizada = $('activity-realizada-' + actividadId).value;
      const material = $('activity-material-' + actividadId).value;
      const comentario = $('activity-comment-' + actividadId).value.trim();
      await handleAction('actualizarActividad', async () => {
        const targetPlan = (state.openPlanId && getPlanById(state.openPlanId)) || getPlanByActivityId(actividadId);
        const targetPlanId = targetPlan && targetPlan.planeacion_id ? targetPlan.planeacion_id : String(state.openPlanId || '').trim();
        const draftActivity = state.openPlanDraft && Array.isArray(state.openPlanDraft.activities)
          ? state.openPlanDraft.activities.find((item) => item.actividad_id === actividadId)
          : null;
        await api('actualizarActividad', {
          actividad_id: actividadId,
          realizada,
          material_en_carpeta: material,
          comentario_cierre: comentario,
          last_known_updated_at: lastKnownUpdatedAt,
          request_id: uid('ACTUPD')
        });
        if (draftActivity) {
          draftActivity.realizada = realizada;
          draftActivity.material_en_carpeta = material;
          draftActivity.comentario_cierre = comentario;
        }
        await refreshSinglePlaneacionSurface(targetPlanId, {
          activityIds: [actividadId],
          snapshotKind: 'actividad_actualizada'
        });
        setBanner('Actividad actualizada.', 'success');
      }, { button, key: buildActionKey('actualizarActividad', [actividadId, realizada, material, comentario.slice(0, 20)]) });
    }

    async function saveGeneralObservation(button, planId) {
      const input = $('obs-general-' + planId);
      const texto = input ? input.value.trim() : '';
      if (!texto) throw new Error('Escribe la observaci\u00f3n general.');
      await handleAction('crearObsSemana', async () => {
        const previousValue = input ? input.value : '';
        if (input) input.value = '';
        try {
          await persistGeneralObservation(planId, texto);
          await refreshSinglePlaneacionSurface(planId, {
            snapshotKind: 'obs_general'
          });
          setBanner('Observaci\u00f3n general guardada.', 'success');
        } catch (error) {
          if (input) input.value = previousValue;
          throw error;
        }
      }, { button, key: buildActionKey('crearObsSemana', [planId, texto.slice(0, 40)]) });
    }

    async function saveAlumnoFinalObservation(button, planId, alumnoId) {
      const input = $('obs-final-' + planId + '-' + alumnoId);
      const nota = input ? input.value.trim() : '';
      if (!nota) throw new Error('Escribe la observaci\u00f3n final del alumno.');
      await handleAction('guardarObsAlumnoFinal', async () => {
        await persistAlumnoFinalObservation(planId, alumnoId, nota);
        await refreshSinglePlaneacionSurface(planId, {
          snapshotKind: 'obs_final_alumno'
        });
        setBanner('Observaci\u00f3n final por alumno guardada.', 'success');
      }, { button, key: buildActionKey('guardarObsAlumnoFinal', [planId, alumnoId, nota.slice(0, 40)]) });
    }

    function autoGrowObsFinal(textarea) {
      if (!textarea) return;
      textarea.style.height = '54px';
      textarea.style.height = Math.max(54, textarea.scrollHeight) + 'px';
    }

    async function saveAllAlumnoFinalObservations(button, planId) {
      const plan = getPlanById(planId);
      if (!plan) throw new Error('Planeaci\u00f3n no encontrada.');
      const entry = getPlaneacionEntryByKey(getPlaneacionEntryKey(plan));
      const payloads = collectPendingAlumnoFinalObservations(planId, plan, entry);
      if (!payloads.length) throw new Error('Escribe al menos una observaci\u00f3n final.');

      await handleAction('guardarObsAlumnoFinalLote', async () => {
        await persistAlumnoFinalObservationBatch(planId, payloads);
        await refreshSinglePlaneacionSurface(planId, {
          snapshotKind: 'obs_final_lote'
        });
        payloads.forEach((row) => {
          const input = $('obs-final-' + (row.planId || planId) + '-' + row.alumnoId);
          if (input) autoGrowObsFinal(input);
        });
        setBanner('Observaciones finales guardadas.', 'success');
      }, { button, key: buildActionKey('guardarObsAlumnoFinalLote', [planId, payloads.map((row) => row.alumnoId + ':' + row.nota.slice(0, 20)).join('|')]) });
    }

    async function editPlan(button, planId) {
      let plan = null;
      await handleAction('editPlanLoad', async () => {
        const result = await Promise.all([
          ensurePlaneacionDetailLoaded(planId, { silent: true }),
          ensurePlaneacionesCatalogosAvailable({ render: false, scope: 'editor' }).catch(() => state.catalogos)
        ]);
        plan = result[0];
      }, {
        button,
        key: buildActionKey('editPlanLoad', [planId]),
        busyText: 'Abriendo...'
      });
      if (!plan) throw new Error('Planeaci\u00f3n no encontrada.');
      loadPlanIntoEditor(plan);
      activateTab('planeaciones');
    }

    function buildOpenPlanSaveRequest(plan, draft) {
      const fallbackDate = getWeekStartDateForPlan(plan);
      const hasDraftDate = draft && Object.prototype.hasOwnProperty.call(draft, 'fecha_planeacion');
      const fechaPlaneacion = hasDraftDate ? String(draft.fecha_planeacion || '').trim() : fallbackDate;
      const semana = resolveWeekForPlanDate(plan, fechaPlaneacion);
      if (!semana) throw createInlineFieldValidationError('Selecciona una fecha v\u00e1lida.', getOpenPlanInlineFieldId(plan, 'fecha'));
      const hasDraftMateria = draft && Object.prototype.hasOwnProperty.call(draft, 'materia_id');
      const materiaId = String(hasDraftMateria ? draft.materia_id : (plan && plan.materia_id) || '').trim();
      if (!materiaId) throw createInlineFieldValidationError('Selecciona una materia.', getOpenPlanInlineFieldId(plan, 'materia'));
      const hasDraftSubmateria = draft && Object.prototype.hasOwnProperty.call(draft, 'submateria_id');
      const hasDraftTaller = draft && Object.prototype.hasOwnProperty.call(draft, 'taller_id');
      const submateriaId = String(hasDraftSubmateria ? draft.submateria_id : '').trim();
      const tallerId = String(hasDraftTaller ? draft.taller_id : (plan && plan.taller_id) || '').trim();
      if (materiaRequiresPlanSubmateria(materiaId) && !submateriaId) {
        throw createInlineFieldValidationError('Selecciona una submateria.', getOpenPlanInlineFieldId(plan, 'submateria'));
      }
      const alumnosIds = Array.from(new Set(draft.alumnos_ids || []));
      if (!alumnosIds.length) throw createInlineFieldValidationError('Selecciona al menos un alumno.', getOpenPlanInlineFieldId(plan, 'alumnos'));
      const actividades = (draft.activities || [])
        .map((activity) => ({
          actividad_id: activity.actividad_id || '',
          texto: String(activity.texto || '').trim(),
          material_en_carpeta: activity.material_en_carpeta || 'no_requiere',
          realizada: activity.realizada || '',
          comentario_cierre: String(activity.comentario_cierre || '').trim(),
          last_known_updated_at: activity.last_known_updated_at || ''
        }))
        .filter((activity) => activity.texto);
      if (!actividades.length) throw createInlineFieldValidationError('Captura al menos una actividad.', getOpenPlanInlineFieldId(plan, 'activities'));
      return {
        fallbackDate,
        semana,
        materiaId,
        submateriaId,
        tallerId,
        alumnosIds,
        actividades
      };
    }

    function normalizeIdList(values) {
      return Array.from(new Set((values || []).map((value) => String(value || '').trim()).filter(Boolean))).sort();
    }

    function shouldUseLightOpenPlanSave(plan, draft, request) {
      if (!plan || !draft || !request) return false;
      const targetSemanaId = String((request.semana && request.semana.semana_id) || '').trim();
      const currentSemanaId = String(plan.semana_id || '').trim();
      const targetMateriaId = String(request.materiaId || '').trim();
      const currentMateriaId = String(plan.materia_id || '').trim();
      const targetSubmateriaId = String(request.submateriaId || '').trim();
      const currentSubmateriaId = String(plan.submateria_id || '').trim();
      const targetTallerId = String(request.tallerId || '').trim();
      const currentTallerId = String(plan.taller_id || '').trim();
      if (!targetSemanaId || targetSemanaId !== currentSemanaId) return false;
      if (targetMateriaId !== currentMateriaId) return false;
      if (targetSubmateriaId !== currentSubmateriaId) return false;
      if (targetTallerId !== currentTallerId) return false;
      const currentAlumnoIds = normalizeIdList(
        Array.isArray(plan.alumnos) && plan.alumnos.length
          ? plan.alumnos.map((row) => row && row.alumno_id)
          : (Array.isArray(draft.original_alumnos_ids) ? draft.original_alumnos_ids : [])
      );
      const nextAlumnoIds = normalizeIdList(request.alumnosIds);
      if (!currentAlumnoIds.length) return false;
      return JSON.stringify(currentAlumnoIds) === JSON.stringify(nextAlumnoIds);
    }

    function isFullSaveRequiredError(error) {
      return !!(error && error.code === 'FULL_SAVE_REQUIRED');
    }

    async function persistOpenPlanDraft(button, planId, draft, options = {}) {
      const plan = getPlanById(planId);
      if (!plan || !draft) throw new Error('Planeaci\u00f3n no encontrada.');
      const request = buildOpenPlanSaveRequest(plan, draft);
      const successMessage = options.successMessage || 'Planeaci\u00f3n actualizada.';
      const actionLabel = options.actionLabel || 'guardarPlaneacionCompletaInline';
      const actionKey = options.actionKey || buildActionKey(actionLabel, [planId, request.fallbackDate, request.alumnosIds.join(',')]);
      await handleAction(actionLabel, async () => {
        const response = await persistOpenPlanDraftApi(planId, draft, plan, request);
        const updatedPlan = response && response.planeacion ? response.planeacion : null;
        if (!shouldRefetchPlaneacionesAfterPlanSave(plan, updatedPlan)) {
          applySavedPlaneacionDetail(planId, updatedPlan);
          persistCurrentBootSnapshot(options.snapshotKind || 'planeacion_inline_save');
          renderPlaneacionesSurface({
            includeStats: true,
            includePlaneaciones: true,
            includeAlertas: false
          });
          refreshPlaneacionesAlertsDeferred({
            force: !!options.forceAlertas
          });
        } else {
          state.openPlanId = planId;
          state.openPlanDraft = null;
          await refreshPlaneacionesSurface();
          if (options.forceAlertas) {
            refreshPlaneacionesAlertsDeferred({
              force: true,
              includeStats: false,
              includePlaneaciones: false
            }).catch(() => {});
          }
        }
        setBanner(successMessage, 'success');
      }, {
        button,
        key: actionKey,
        busyText: options.busyText || button && button.textContent || 'Guardando...'
      });
    }

    async function saveOpenPlan(button, planId) {
      const plan = getPlanById(planId);
      const draft = getOpenPlanDraft(plan);
      await persistOpenPlanDraft(button, planId, draft, {
        successMessage: 'Planeaci\u00f3n actualizada.',
        actionLabel: 'guardarPlaneacionCompletaInline',
        forceAlertas: planDraftAffectsMaterialAlerts(draft)
      });
    }

    function buildMaterialReadyDraft(draft) {
      const nextDraft = cloneJsonSafe(draft, draft);
      nextDraft.activities = (Array.isArray(nextDraft.activities) ? nextDraft.activities : []).map((activity) => {
        if (normalizeMaterialStatus((activity && activity.material_en_carpeta) || 'no_requiere') !== 'no_listo') {
          return activity;
        }
        return Object.assign({}, activity, {
          material_en_carpeta: 'listo'
        });
      });
      nextDraft.activitiesDirty = true;
      return nextDraft;
    }

    function buildMaterialReadyPlanPatch(plan, readyDraft) {
      const draftActivitiesById = new Map(
        (Array.isArray(readyDraft && readyDraft.activities) ? readyDraft.activities : [])
          .map((activity) => [String((activity && activity.actividad_id) || '').trim(), activity])
          .filter((entry) => entry[0])
      );
      const sourceActivities = Array.isArray(plan && plan.actividades) && plan.actividades.length
        ? plan.actividades
        : (Array.isArray(readyDraft && readyDraft.activities) ? readyDraft.activities : []);
      return {
        material_confirmado: 'si',
        actividades: sourceActivities.map((activity) => {
          const activityId = String((activity && activity.actividad_id) || '').trim();
          const draftActivity = activityId ? draftActivitiesById.get(activityId) : null;
          const nextMaterial = draftActivity
            ? normalizeMaterialStatus(draftActivity.material_en_carpeta)
            : (normalizeMaterialStatus((activity && activity.material_en_carpeta) || 'no_requiere') === 'no_listo' ? 'listo' : normalizeMaterialStatus((activity && activity.material_en_carpeta) || 'no_requiere'));
          return Object.assign({}, activity, {
            material_en_carpeta: nextMaterial
          });
        })
      };
    }

    async function saveMultiGroupShared(button, entryKey) {
      const entry = getPlaneacionEntryByKey(entryKey);
      if (!entry || !entry.isMulti) throw new Error('Planeaci\u00f3n multigrupo no encontrada.');
      const draft = getMultiGroupSharedDraft(entry);
      await handleAction('guardarPlaneacionMultigrupo', async () => {
        await persistMultiGroupSharedApi(entry, draft);
        state.multiGroupSharedDrafts[entryKey] = null;
        state.openPlanDraft = null;
        await refreshPlaneacionesSurface();
        setBanner('Base multigrupo actualizada.', 'success');
      }, {
        button,
        key: buildActionKey('guardarPlaneacionMultigrupo', [
          entryKey,
          String((draft && draft.fecha_planeacion) || ''),
          ((draft && draft.activities) || []).map((activity) => [
            String((activity && activity.texto) || '').trim(),
            normalizeMaterialStatus((activity && activity.material_en_carpeta) || 'no_requiere'),
            normalizeRealizadaStatus((activity && activity.realizada) || ''),
            String((activity && activity.comentario_cierre) || '').trim()
          ].join(':')).join('|')
        ]),
        busyText: 'Guardando lote...'
      });
    }

    function getPendingGeneralObservationText(planId) {
      const normalizedPlanId = String(planId || '').trim();
      const input = $('obs-general-' + normalizedPlanId);
      const inputValue = input ? String(input.value || '').trim() : '';
      const currentPlan = getPlanById(normalizedPlanId);
      const storedValue = currentPlan ? String(currentPlan._draft_general_observation_text || '').trim() : '';
      const currentDraft = state.openPlanDraft && String(state.openPlanDraft.planId || '').trim() === normalizedPlanId
        ? state.openPlanDraft
        : null;
      const draftValue = currentDraft ? String(currentDraft.generalObservationText || '').trim() : '';
      const draftDirty = !!(currentDraft && currentDraft.generalObservationDirty === true);
      if (inputValue) {
        if (draftDirty || inputValue !== storedValue) return inputValue;
        return '';
      }
      return draftDirty ? draftValue : '';
    }

    function collectPendingAlumnoFinalObservations(planId, plan, entry) {
      const normalizedPlanId = String(planId || '').trim();
      const draftMap = state.openPlanDraft && String(state.openPlanDraft.planId || '').trim() === normalizedPlanId
        ? (state.openPlanDraft.finalObservationsByKey || {})
        : {};
      const planDraftMap = Object.assign({}, ((plan || getPlanById(normalizedPlanId) || {})._draft_final_observations_by_key || {}));
      const targetEntry = entry && entry.isMulti ? entry : null;
      const alumnosRows = targetEntry
        ? getPlaneacionEntryAlumnoRows(targetEntry)
        : (Array.isArray((plan || getPlanById(normalizedPlanId) || {}).alumnos) ? (plan || getPlanById(normalizedPlanId)).alumnos : []);
      if (!alumnosRows.length) return [];
      return alumnosRows.map((alumnoRow) => {
        const alumnoId = alumnoRow.alumno_id;
        const targetPlanId = String(alumnoRow.planeacion_id || normalizedPlanId);
        const input = $('obs-final-' + targetPlanId + '-' + alumnoId);
        const inputValue = input ? String(input.value || '').trim() : '';
        const fallbackValue =
          String(draftMap[targetPlanId + '::' + alumnoId] || '').trim() ||
          String(draftMap[alumnoId] || '').trim() ||
          String(planDraftMap[targetPlanId + '::' + alumnoId] || '').trim() ||
          String(planDraftMap[alumnoId] || '').trim();
        const nota = inputValue || fallbackValue;
        return { planId: targetPlanId, alumnoId, nota };
      }).filter((row) => row.nota);
    }

    function collectStoredAlumnoFinalObservations(planId, plan, entry) {
      const normalizedPlanId = String(planId || '').trim();
      const currentPlan = plan || getPlanById(normalizedPlanId);
      const draftMap = state.openPlanDraft && String(state.openPlanDraft.planId || '').trim() === normalizedPlanId
        ? (state.openPlanDraft.finalObservationsByKey || {})
        : {};
      const planDraftMap = Object.assign({}, ((currentPlan || {})._draft_final_observations_by_key || {}));
      const targetEntry = entry && entry.isMulti ? entry : null;
      const alumnosRows = targetEntry
        ? getPlaneacionEntryAlumnoRows(targetEntry)
        : (Array.isArray((currentPlan || {}).alumnos) ? currentPlan.alumnos : []);
      if (!alumnosRows.length) return [];
      return alumnosRows.map((alumnoRow) => {
        const alumnoId = String((alumnoRow && alumnoRow.alumno_id) || '').trim();
        const targetPlanId = String((alumnoRow && (alumnoRow.planeacion_id || normalizedPlanId)) || '').trim();
        const nota =
          String(draftMap[targetPlanId + '::' + alumnoId] || '').trim() ||
          String(draftMap[alumnoId] || '').trim() ||
          String(planDraftMap[targetPlanId + '::' + alumnoId] || '').trim() ||
          String(planDraftMap[alumnoId] || '').trim();
        if (!alumnoId || !nota) return null;
        return {
          planId: targetPlanId || normalizedPlanId,
          alumnoId,
          nota
        };
      }).filter(Boolean);
    }

    async function persistGeneralObservation(planId, texto) {
      await api('crearObsSemana', {
        planeacion_id: planId,
        texto,
        request_id: uid('OSG')
      });
    }

    async function persistAlumnoFinalObservation(planId, alumnoId, nota) {
      await api('guardarObsAlumnoFinal', {
        planeacion_id: planId,
        alumno_id: alumnoId,
        nota,
        request_id: uid('OAF')
      });
    }

    async function persistAlumnoFinalObservationBatch(planId, payloads) {
      await api('guardarObsAlumnoFinalLote', {
        items: payloads.map((row) => ({
          planeacion_id: row.planId || planId,
          alumno_id: row.alumnoId,
          nota: row.nota
        })),
        request_id: uid('OAFL')
      });
    }

    function clearPendingPlanSaveTransaction(planId) {
      const normalizedPlanId = String(planId || '').trim();
      if (!normalizedPlanId || !state.ui || !state.ui.pendingPlanSaveTransactions) return;
      delete state.ui.pendingPlanSaveTransactions[normalizedPlanId];
    }

    function buildPlanSaveTransactionFingerprint(config = {}) {
      return JSON.stringify({
        planId: String(config.planId || '').trim(),
        generalText: String(config.generalText || '').trim(),
        finalPayloads: (config.finalPayloads || []).map((row) => ({
          planId: String((row && row.planId) || '').trim(),
          alumnoId: String((row && row.alumnoId) || '').trim(),
          nota: String((row && row.nota) || '').trim()
        })),
        planSaveAction: String(config.planSaveAction || '').trim(),
        planSavePayload: config.planSavePayload
          ? Object.assign({}, config.planSavePayload, { request_id: '' })
          : null
      });
    }

    function buildPlanSaveTransactionBundle(config = {}) {
      const normalizedPlanId = String(config.planId || '').trim();
      if (!normalizedPlanId) throw new Error('Planeaci\u00f3n no encontrada.');
      if (!state.ui) state.ui = {};
      if (!state.ui.pendingPlanSaveTransactions) state.ui.pendingPlanSaveTransactions = {};
      const fingerprint = buildPlanSaveTransactionFingerprint(config);
      const existing = state.ui.pendingPlanSaveTransactions[normalizedPlanId];
      if (existing && existing.fingerprint === fingerprint && existing.bundle) {
        return cloneJsonSafe(existing.bundle, existing.bundle) || existing.bundle;
      }
      const rootRequestId = uid('PLASAVE');
      const bundle = {
        planeacion_id: normalizedPlanId,
        request_id: rootRequestId,
        general_observation: String(config.generalText || '').trim()
          ? {
              planeacion_id: normalizedPlanId,
              texto: String(config.generalText || '').trim(),
              request_id: rootRequestId + ':obsg'
            }
          : null,
        final_observation_batch: Array.isArray(config.finalPayloads) && config.finalPayloads.length
          ? {
              items: config.finalPayloads.map((row) => ({
                planeacion_id: row.planId || normalizedPlanId,
                alumno_id: row.alumnoId,
                nota: row.nota
              })),
              request_id: rootRequestId + ':obsf'
            }
          : null,
        plan_save_action: String(config.planSaveAction || '').trim() || '',
        plan_save: config.planSavePayload
          ? Object.assign({}, config.planSavePayload, {
              request_id: rootRequestId + ':plan'
            })
          : null
      };
      state.ui.pendingPlanSaveTransactions[normalizedPlanId] = {
        fingerprint,
        bundle
      };
      return cloneJsonSafe(bundle, bundle) || bundle;
    }

    function buildOpenPlanDraftWithPendingObservations(draft, generalText, finalPayloads) {
      if (!draft || typeof draft !== 'object') return draft;
      const nextDraft = cloneJsonSafe(draft, draft) || draft;
      const trimmedGeneral = String(generalText || '').trim();
      if (trimmedGeneral) {
        nextDraft.generalObservationText = trimmedGeneral;
      }
      if (!nextDraft.finalObservationsByKey || typeof nextDraft.finalObservationsByKey !== 'object') {
        nextDraft.finalObservationsByKey = {};
      }
      (Array.isArray(finalPayloads) ? finalPayloads : []).forEach((row) => {
        const alumnoId = String((row && row.alumnoId) || '').trim();
        const targetPlanId = String((row && (row.planId || nextDraft.planId)) || '').trim();
        const nota = String((row && row.nota) || '').trim();
        if (!alumnoId || !nota) return;
        nextDraft.finalObservationsByKey[alumnoId] = nota;
        if (targetPlanId) {
          nextDraft.finalObservationsByKey[targetPlanId + '::' + alumnoId] = nota;
        }
      });
      return nextDraft;
    }

    async function persistPlanChangesCompositeApi(bundle) {
      return await api('guardarCambiosPlaneacion', bundle);
    }

    function buildPlaneacionOutboxItem(kind, payload = {}) {
      const createdAt = new Date().toISOString();
      return Object.assign({
        id: uid('PLOUT'),
        kind: String(kind || '').trim(),
        ownerKey: getPlaneacionOutboxOwnerKey(),
        mergeKey: '',
        status: 'pending',
        retryable: true,
        attempts: 0,
        created_at: createdAt,
        updated_at: createdAt,
        nextAttemptAt: ''
      }, payload);
    }

    function markPlaneacionOutboxItem(itemId, patch = {}) {
      const normalizedId = String(itemId || '').trim();
      if (!normalizedId) return null;
      let updatedItem = null;
      const items = (state.planeacionOutbox || []).map((item) => {
        if (!item || String(item.id || '').trim() !== normalizedId) return item;
        updatedItem = Object.assign({}, item, patch, {
          updated_at: new Date().toISOString()
        });
        return updatedItem;
      });
      setPlaneacionOutboxItems(items);
      return updatedItem;
    }

    function removePlaneacionOutboxItem(itemId) {
      const normalizedId = String(itemId || '').trim();
      if (!normalizedId) return;
      const items = (state.planeacionOutbox || []).filter((item) => String((item && item.id) || '').trim() !== normalizedId);
      setPlaneacionOutboxItems(items);
    }

    function enqueuePlaneacionOutboxItem(item) {
      if (!item || !item.id) return null;
      const nextItem = Object.assign({}, item, {
        ownerKey: item.ownerKey || getPlaneacionOutboxOwnerKey(),
        updated_at: new Date().toISOString()
      });
      const items = Array.isArray(state.planeacionOutbox) ? state.planeacionOutbox.slice() : [];
      const mergeKey = String(nextItem.mergeKey || '').trim();
      const existingIndex = mergeKey
        ? items.findIndex((row) => row && row.mergeKey === mergeKey && String(row.status || '').trim() !== 'syncing')
        : -1;
      if (existingIndex >= 0) {
        items.splice(existingIndex, 1, nextItem);
      } else {
        items.push(nextItem);
      }
      setPlaneacionOutboxItems(items);
      applyPlaneacionOutboxVisualState(nextItem);
      persistCurrentBootSnapshot('planeacion_outbox_enqueue');
      schedulePlaneacionOutboxProcessing(90);
      return nextItem;
    }

    function clearPlaneacionOutboxRetryTimer() {
      if (!state.ui || !state.ui.planeacionOutboxRetryTimer) return;
      window.clearTimeout(state.ui.planeacionOutboxRetryTimer);
      state.ui.planeacionOutboxRetryTimer = null;
    }

    function hasPendingPlaneacionOutboxForPlan(planId) {
      const normalizedPlanId = String(planId || '').trim();
      if (!normalizedPlanId) return false;
      return (state.planeacionOutbox || []).some((item) => {
        if (!item) return false;
        if (String((item.planId || '')).trim() !== normalizedPlanId) return false;
        const status = String(item.status || '').trim();
        return !status || status === 'pending' || status === 'syncing';
      });
    }

    function getNextPlaneacionOutboxItem() {
      const now = Date.now();
      return (state.planeacionOutbox || []).find((item) => {
        if (!item || !item.id) return false;
        const status = String(item.status || '').trim();
        if (status === 'pending') return true;
        if (status !== 'error' || item.retryable === false) return false;
        if (!item.nextAttemptAt) return true;
        const retryAt = Date.parse(item.nextAttemptAt);
        return Number.isFinite(retryAt) && retryAt <= now;
      }) || null;
    }

    function isPlaneacionOutboxRetryableError(error) {
      const code = String((error && error.code) || '').trim().toUpperCase();
      const message = String((error && error.message) || '').trim().toLowerCase();
      if (!code) return true;
      if (code === 'SERVER_ERROR' && message.includes('no cuentas con el permiso necesario para acceder al documento solicitado')) {
        return false;
      }
      return ![
        'VALIDATION_ERROR',
        'FULL_SAVE_REQUIRED',
        'NOT_FOUND',
        'NO_ACCESS',
        'FORBIDDEN',
        'CONFLICT',
        'DUPLICATE'
      ].includes(code);
    }

    function getPlaneacionOutboxRetryDelay(error, attempts) {
      const normalizedAttempts = Math.max(1, Number(attempts || 0));
      const code = String((error && error.code) || '').trim().toUpperCase();
      if (code === 'RATE_LIMIT') {
        return Math.min(60000, 10000 * Math.pow(2, normalizedAttempts - 1));
      }
      return Math.min(30000, 1200 * normalizedAttempts);
    }

    function schedulePlaneacionOutboxProcessing(delay = 120) {
      if (!isPlaneacionOutboxEnabled() || !Array.isArray(state.planeacionOutbox) || !state.planeacionOutbox.length) return;
      clearPlaneacionOutboxRetryTimer();
      if (!state.ui) return;
      state.ui.planeacionOutboxRetryTimer = window.setTimeout(() => {
        state.ui.planeacionOutboxRetryTimer = null;
        processPlaneacionOutboxQueue().catch(() => {});
      }, Math.max(40, Number(delay || 0)));
    }

    async function performOpenPlanSaveRequest(action, payload) {
      try {
        return await api(action, payload);
      } catch (error) {
        if (String(action || '').trim() === 'guardarPlaneacionLigera' && isFullSaveRequiredError(error)) {
          return await api('guardarPlaneacionCompleta', payload);
        }
        throw error;
      }
    }

    function repairPlanSavePayloadSemanaFromPreviousPlan(payload, previousPlan) {
      if (!payload || typeof payload !== 'object' || !previousPlan) return payload;
      const currentSemana = getWeekByIdOrInferred(previousPlan.semana_id);
      if (!currentSemana || !currentSemana.semana_id) return payload;
      const fechaPlaneacion = toYmdFrontend_(payload.fecha_planeacion || getWeekStartDateForPlan(previousPlan));
      if (!semanaContainsDate(currentSemana, fechaPlaneacion)) return payload;
      const currentSemanaId = String(currentSemana.semana_id || '').trim();
      if (!currentSemanaId || String(payload.semana_id || '').trim() === currentSemanaId) return payload;
      return Object.assign({}, payload, {
        semana_id: currentSemanaId
      });
    }

    function repairPlaneacionOutboxOpenSaveSemana(item) {
      if (!item || typeof item !== 'object') return item;
      const previousPlan = item.previousPlanSnapshot || getPlanById(item.planId);
      if (!previousPlan) return item;
      let changed = false;
      let nextCombinedRequest = item.combinedRequest;
      if (nextCombinedRequest && typeof nextCombinedRequest === 'object' && nextCombinedRequest.plan_save) {
        const repairedPlanSave = repairPlanSavePayloadSemanaFromPreviousPlan(nextCombinedRequest.plan_save, previousPlan);
        if (repairedPlanSave !== nextCombinedRequest.plan_save) {
          nextCombinedRequest = Object.assign({}, nextCombinedRequest, {
            plan_save: repairedPlanSave
          });
          changed = true;
        }
      }
      let nextRequests = item.requests;
      if (nextRequests && typeof nextRequests === 'object' && nextRequests.planSave) {
        const repairedPlanSave = repairPlanSavePayloadSemanaFromPreviousPlan(nextRequests.planSave, previousPlan);
        if (repairedPlanSave !== nextRequests.planSave) {
          nextRequests = Object.assign({}, nextRequests, {
            planSave: repairedPlanSave
          });
          changed = true;
        }
      }
      if (!changed) return item;
      return markPlaneacionOutboxItem(item.id, {
        combinedRequest: nextCombinedRequest,
        requests: nextRequests
      }) || Object.assign({}, item, {
        combinedRequest: nextCombinedRequest,
        requests: nextRequests
      });
    }

    function getOutboxSemanaPayloadSignature(item) {
      const combinedPlanSave = item && item.combinedRequest && item.combinedRequest.plan_save
        ? item.combinedRequest.plan_save
        : {};
      const requestPlanSave = item && item.requests && item.requests.planSave
        ? item.requests.planSave
        : {};
      return JSON.stringify({
        combinedSemanaId: String(combinedPlanSave.semana_id || '').trim(),
        requestSemanaId: String(requestPlanSave.semana_id || '').trim()
      });
    }

    function repairHydratedPlaneacionOutboxSemanaPayloads() {
      if (!Array.isArray(state.planeacionOutbox) || !state.planeacionOutbox.length) return;
      state.planeacionOutbox.slice().forEach((item) => {
        if (!item || String(item.kind || '').trim() !== 'open_save') return;
        const before = getOutboxSemanaPayloadSignature(item);
        const repaired = repairPlaneacionOutboxOpenSaveSemana(item);
        const after = getOutboxSemanaPayloadSignature(repaired);
        if (before === after) return;
        if (String((repaired && repaired.status) || '').trim() === 'error' || repaired.retryable === false) {
          markPlaneacionOutboxItem(repaired.id, {
            status: 'pending',
            retryable: true,
            attempts: 0,
            lastErrorCode: '',
            lastErrorMessage: '',
            nextAttemptAt: ''
          });
        }
      });
    }

    async function processPlaneacionOutboxEditorCreate(item) {
      const responseData = await api(item.requestAction || 'crearPlaneacion', item.requestPayload || {});
      const createdPlans = Array.isArray(responseData && responseData.planeaciones)
        ? responseData.planeaciones.filter((plan) => plan && plan.planeacion_id)
        : [];
      if (Array.isArray(item.tempPlanIds) && item.tempPlanIds.length) {
        removePlaneacionRows(item.tempPlanIds);
      }
      if (createdPlans.length) {
        const appliedPlans = upsertPlaneacionesRows(createdPlans.map((plan) => Object.assign({}, plan, {
          _local_save_state: 'saved',
          _local_save_message: 'Planeación sincronizada.'
        })));
        if (item.forceAlertas) injectLocalMaterialAlerts(appliedPlans);
        renderPlaneacionesSurface({
          includeStats: true,
          includePlaneaciones: true,
          includeAlertas: false
        });
        persistCurrentBootSnapshot('planeacion_outbox_create_synced');
        scheduleClearLocalPlaneacionFeedback(appliedPlans.map((plan) => plan.planeacion_id));
        refreshPlaneacionesAlertsDeferred({
          force: !!item.forceAlertas
        }).catch(() => {});
        if (appliedPlans[0] && appliedPlans[0].planeacion_id) {
          focusPlaneacionCardSoon(appliedPlans[0].planeacion_id);
        }
      }
    }

    async function processPlaneacionOutboxEditorEdit(item) {
      const responseData = await api(item.requestAction || 'guardarPlaneacionCompleta', item.requestPayload || {});
      const previousPlan = item.previousPlanSnapshot || getPlanById(item.planId);
      const updatedPlan = responseData && responseData.planeacion
        ? Object.assign({}, previousPlan || {}, responseData.planeacion)
        : null;
      if (updatedPlan && !shouldRefetchPlaneacionesAfterPlanSave(previousPlan, updatedPlan)) {
        upsertPlaneacionRow(Object.assign({}, updatedPlan, {
          _local_save_state: 'saved',
          _local_save_message: 'Planeación sincronizada.'
        }));
        if (state.openPlanId === updatedPlan.planeacion_id) {
          state.openPlanDraft = buildOpenPlanDraft(getPlanById(updatedPlan.planeacion_id) || updatedPlan);
        }
        renderPlaneacionesSurface({
          includeStats: true,
          includePlaneaciones: true,
          includeAlertas: false
        });
        persistCurrentBootSnapshot('planeacion_outbox_edit_synced');
        scheduleClearLocalPlaneacionFeedback(updatedPlan.planeacion_id);
        refreshPlaneacionesAlertsDeferred({
          force: !!item.forceAlertas
        }).catch(() => {});
        return;
      }
      await refreshPlaneacionesSurface({ includeAlertas: false });
      refreshPlaneacionesAlertsDeferred({
        force: !!item.forceAlertas,
        includeStats: false,
        includePlaneaciones: false
      }).catch(() => {});
    }

    async function processPlaneacionOutboxOpenSave(item, trace = null) {
      item = repairPlaneacionOutboxOpenSaveSemana(item);
      const combinedRequest = item.combinedRequest && typeof item.combinedRequest === 'object'
        ? item.combinedRequest
        : null;
      let savedPlanResponse = null;
      if (combinedRequest) {
        markSaveTrace(trace, 'outbox_api_composite_start', {
          transactionId: combinedRequest.transaction_id || ''
        });
        const compositeResponse = await persistPlanChangesCompositeApi(combinedRequest);
        markSaveTrace(trace, 'outbox_api_composite_done');
        savedPlanResponse = compositeResponse && compositeResponse.plan_save
          ? compositeResponse.plan_save
          : (compositeResponse && compositeResponse.planeacion ? { planeacion: compositeResponse.planeacion } : null);
      } else {
        const requests = item.requests && typeof item.requests === 'object' ? item.requests : {};
        if (requests.generalObservation) {
          markSaveTrace(trace, 'outbox_api_general_observation_start');
          await api('crearObsSemana', requests.generalObservation);
          markSaveTrace(trace, 'outbox_api_general_observation_done');
        }
        if (requests.finalObservationBatch) {
          markSaveTrace(trace, 'outbox_api_final_observations_start', {
            count: Array.isArray(requests.finalObservationBatch.items) ? requests.finalObservationBatch.items.length : 0
          });
          await api('guardarObsAlumnoFinalLote', requests.finalObservationBatch);
          markSaveTrace(trace, 'outbox_api_final_observations_done');
        }
        if (requests.planSave) {
          markSaveTrace(trace, 'outbox_api_plan_save_start', {
            action: item.planSaveAction || 'guardarPlaneacionCompleta'
          });
          savedPlanResponse = await performOpenPlanSaveRequest(item.planSaveAction || 'guardarPlaneacionCompleta', requests.planSave);
          markSaveTrace(trace, 'outbox_api_plan_save_done');
        }
      }
      const previousPlan = item.previousPlanSnapshot || getPlanById(item.planId);
      const updatedPlan = savedPlanResponse && savedPlanResponse.planeacion
        ? Object.assign({}, previousPlan || {}, savedPlanResponse.planeacion)
        : null;
      const outboxGeneralText = combinedRequest && combinedRequest.general_observation
        ? String((combinedRequest.general_observation && combinedRequest.general_observation.texto) || '').trim()
        : String((((item.requests || {}).generalObservation || {}).texto) || '').trim();
      const outboxFinalPayloads = combinedRequest && combinedRequest.final_observation_batch && Array.isArray(combinedRequest.final_observation_batch.items)
        ? combinedRequest.final_observation_batch.items.map((row) => ({
            planId: String((row && row.planeacion_id) || item.planId || '').trim(),
            alumnoId: String((row && row.alumno_id) || '').trim(),
            nota: String((row && row.nota) || '').trim()
          })).filter((row) => row.alumnoId && row.nota)
        : (Array.isArray((((item.requests || {}).finalObservationBatch || {}).items))
            ? (((item.requests || {}).finalObservationBatch || {}).items).map((row) => ({
                planId: String((row && row.planeacion_id) || item.planId || '').trim(),
                alumnoId: String((row && row.alumno_id) || '').trim(),
                nota: String((row && row.nota) || '').trim()
              })).filter((row) => row.alumnoId && row.nota)
            : []);
      const planWithSavedObservations = mergeSavedObservationPreview(updatedPlan || previousPlan, outboxGeneralText, outboxFinalPayloads, {
        clearGeneralDraft: true
      });
      const inlineSavedPreview = buildInlineSavedPlaneacionPreview(
        previousPlan,
        item.optimisticPlan || null,
        planWithSavedObservations,
        {
          localState: 'saved',
          localMessage: 'Cambios sincronizados.'
        }
      );
      clearPendingPlanSaveTransaction(item.planId);
      const canPatchSimplePlanLocally = !!(item.shouldSavePlan && !item.shouldSaveShared && updatedPlan);
      if (canPatchSimplePlanLocally && !shouldRefetchPlaneacionesAfterPlanSave(previousPlan, updatedPlan)) {
        markSaveTrace(trace, 'outbox_local_patch_start');
        applySavedPlaneacionDetail(item.planId, inlineSavedPreview || Object.assign({}, planWithSavedObservations, {
          _local_save_state: 'saved',
          _local_save_message: 'Cambios sincronizados.'
        }), { clearGeneralDraft: !!outboxGeneralText, preserveUserOpenState: true });
        persistCurrentBootSnapshot('planeacion_outbox_open_save_local');
        renderPlaneacionesList();
        restorePendingPlanObservationInputs(item.planId, '', outboxFinalPayloads);
        scheduleClearLocalPlaneacionFeedback(item.planId);
        if (item.shouldSavePlan) {
          queuePlaneacionPostSaveSync(item.planId, {
            refreshDetail: false,
            refreshObservaciones: false,
            refreshAlertas: !!item.shouldRefreshMaterialAlertas
          });
        }
        refreshPlaneacionesAlertsDeferred({
          force: !!item.shouldForceAlertasAfterSave
        }).catch(() => {});
        markSaveTrace(trace, 'outbox_local_patch_done');
        return;
      }
      if (!item.shouldSavePlan && !item.shouldSaveShared) {
        markSaveTrace(trace, 'outbox_observations_patch_start');
        applySavedPlaneacionDetail(item.planId, Object.assign({}, planWithSavedObservations, {
          _local_save_state: 'saved',
          _local_save_message: 'Cambios sincronizados.'
        }), { clearGeneralDraft: !!outboxGeneralText, preserveUserOpenState: true });
        persistCurrentBootSnapshot('planeacion_outbox_open_obs_local');
        renderPlaneacionesList();
        restorePendingPlanObservationInputs(item.planId, '', outboxFinalPayloads);
        scheduleClearLocalPlaneacionFeedback(item.planId);
        queuePlaneacionPostSaveSync(item.planId, {
          refreshDetail: true,
          refreshObservaciones: true,
          refreshAlertas: false,
          snapshotKind: 'planeacion_outbox_open_obs'
        });
        markSaveTrace(trace, 'outbox_observations_patch_done');
        return;
      }
      markSaveTrace(trace, 'outbox_refresh_surface_start');
      state.openPlanId = item.shouldSavePlan ? item.planId : state.openPlanId;
      if (state.openPlanId !== item.planId) state.openPlanDraft = null;
      await refreshPlaneacionesSurface({ includeAlertas: false });
      const restoredDraftAfterRefresh = item.shouldSavePlan &&
        restoreOpenPlanDraftAfterSaveRefresh(item.planId, item.draft, '', outboxFinalPayloads);
      if (!restoredDraftAfterRefresh) {
        restorePendingPlanObservationInputs(item.planId, '', outboxFinalPayloads);
      }
      refreshPlaneacionesAlertsDeferred({
        force: !!item.shouldForceAlertasAfterSave,
        includeStats: false,
        includePlaneaciones: false
      }).catch(() => {});
      markSaveTrace(trace, 'outbox_refresh_surface_done');
    }

    function handlePlaneacionOutboxFailure(item, error) {
      const retryable = isPlaneacionOutboxRetryableError(error);
      const attempts = Number(item && item.attempts || 0) + 1;
      const nextDelay = retryable ? getPlaneacionOutboxRetryDelay(error, attempts) : 0;
      const updatedItem = markPlaneacionOutboxItem(item.id, {
        status: 'error',
        retryable,
        attempts,
        lastErrorCode: String((error && error.code) || '').trim(),
        lastErrorMessage: formatApiError(error),
        nextAttemptAt: retryable ? new Date(Date.now() + nextDelay).toISOString() : ''
      });
      if (!retryable && String((item && item.kind) || '').trim() === 'editor_create') {
        rollbackFailedPlaneacionOutboxCreate(Object.assign({}, updatedItem || item, {
          retryable,
          attempts,
          lastErrorCode: String((error && error.code) || '').trim(),
          lastErrorMessage: formatApiError(error)
        }));
        removePlaneacionOutboxItem(item.id);
      } else if (updatedItem) {
        applyPlaneacionOutboxVisualState(updatedItem);
        persistCurrentBootSnapshot('planeacion_outbox_error');
      }
      const shouldNotifyUser = shouldExposePlaneacionOutboxIssue(updatedItem || Object.assign({}, item, {
        retryable,
        attempts,
        lastErrorCode: String((error && error.code) || '').trim()
      }));
      if (retryable && shouldNotifyUser) {
        setBanner(
          String((error && error.code) || '').trim() === 'INVALID_SESSION'
            ? 'Hay cambios guardados localmente pendientes de sincronizar. Vuelve a iniciar sesi\u00f3n.'
            : 'Hay cambios guardados localmente pendientes de sincronizar. Seguiremos intentando.',
          'info'
        );
      } else if (!retryable) {
        setBanner(formatApiError(error), 'error');
      }
      if (shouldNotifyUser) {
        renderPlaneacionesSurface({
          includeStats: true,
          includePlaneaciones: true,
          includeAlertas: false
        });
      }
      if (retryable) schedulePlaneacionOutboxProcessing(nextDelay + 120);
      else schedulePlaneacionOutboxProcessing(120);
    }

    async function processPlaneacionOutboxQueue() {
      if (!isPlaneacionOutboxEnabled() || !state.ui || state.ui.planeacionOutboxProcessing) return;
      const item = getNextPlaneacionOutboxItem();
      if (!item) return;
      const outboxTrace = beginSaveTrace('planeacionOutboxSync', {
        itemId: String(item.id || '').trim(),
        kind: String(item.kind || '').trim(),
        planId: String(item.planId || '').trim(),
        status: String(item.status || '').trim(),
        attempts: Number(item.attempts || 0)
      });
      state.ui.planeacionOutboxProcessing = true;
      const syncingItem = markPlaneacionOutboxItem(item.id, {
        status: 'syncing',
        nextAttemptAt: ''
      }) || item;
      markSaveTrace(outboxTrace, 'outbox_item_syncing');
      applyPlaneacionOutboxVisualState(syncingItem);
      try {
        if (syncingItem.kind === 'editor_create') {
          markSaveTrace(outboxTrace, 'outbox_editor_create_start');
          await processPlaneacionOutboxEditorCreate(syncingItem);
          markSaveTrace(outboxTrace, 'outbox_editor_create_done');
        } else if (syncingItem.kind === 'editor_edit') {
          markSaveTrace(outboxTrace, 'outbox_editor_edit_start');
          await processPlaneacionOutboxEditorEdit(syncingItem);
          markSaveTrace(outboxTrace, 'outbox_editor_edit_done');
        } else if (syncingItem.kind === 'open_save') {
          markSaveTrace(outboxTrace, 'outbox_open_save_start');
          await processPlaneacionOutboxOpenSave(syncingItem, outboxTrace);
          markSaveTrace(outboxTrace, 'outbox_open_save_done');
        }
        removePlaneacionOutboxItem(syncingItem.id);
        markSaveTrace(outboxTrace, 'outbox_item_removed');
        schedulePlaneacionOutboxProcessing(80);
        endSaveTrace(outboxTrace, 'success');
      } catch (error) {
        markSaveTrace(outboxTrace, 'outbox_error', {
          code: error && error.code || '',
          message: error && error.message || String(error || '')
        });
        handlePlaneacionOutboxFailure(syncingItem, error);
        endSaveTrace(outboxTrace, 'error', {
          code: error && error.code || '',
          message: error && error.message || String(error || '')
        });
      } finally {
        state.ui.planeacionOutboxProcessing = false;
      }
    }

    function syncInlineSavedPlanDraft(planId, updatedPlan, options = {}) {
      if (!updatedPlan || !state.openPlanDraft || state.openPlanDraft.planId !== planId) return;
      state.openPlanDraft.lastKnownUpdatedAt = updatedPlan.fecha_actualizacion || state.openPlanDraft.lastKnownUpdatedAt || '';
      state.openPlanDraft.lastKnownActivitiesVersion = updatedPlan.actividades_version_actual || state.openPlanDraft.lastKnownActivitiesVersion || '';
      const activityIds = Array.isArray(options.activityIds) ? options.activityIds.filter(Boolean) : [];
      if (!activityIds.length || !Array.isArray(state.openPlanDraft.activities)) return;
      activityIds.forEach((activityId) => {
        const draftActivity = state.openPlanDraft.activities.find((item) => item.actividad_id === activityId);
        const freshActivity = Array.isArray(updatedPlan.actividades)
          ? updatedPlan.actividades.find((item) => item.actividad_id === activityId)
          : null;
        if (!draftActivity || !freshActivity) return;
        draftActivity.realizada = normalizeRealizadaStatus(freshActivity.realizada);
        draftActivity.material_en_carpeta = normalizeMaterialStatus(freshActivity.material_en_carpeta);
        draftActivity.comentario_cierre = freshActivity.comentario_cierre || '';
        draftActivity.last_known_updated_at = freshActivity.fecha_actualizacion || draftActivity.last_known_updated_at || '';
      });
    }

    async function refreshSinglePlaneacionSurface(planId, options = {}) {
      const normalizedPlanId = String(planId || '').trim();
      if (!normalizedPlanId) throw new Error('Planeaci\u00f3n no encontrada.');
      const updatedPlan = await fetchPlaneacionDetalle(normalizedPlanId);
      if (!updatedPlan || !updatedPlan.planeacion_id) throw new Error('No se pudo recargar la planeaci\u00f3n.');
      upsertPlaneacionRow(updatedPlan);
      syncInlineSavedPlanDraft(normalizedPlanId, updatedPlan, options);
      persistCurrentBootSnapshot(options.snapshotKind || 'planeacion_inline_save');
      renderPlaneacionesSurface({
        includeStats: options.includeStats === true,
        includePlaneaciones: true,
        includeAlertas: options.includeAlertas === true
      });
      return updatedPlan;
    }

    function refreshPlaneacionesAlertsDeferred(options = {}) {
      const includeStats = options.includeStats === true;
      const includePlaneaciones = options.includePlaneaciones === true;
      const delay = Number(options.delay || 140);
      if (!options.force && shouldReuseFacilitadorFeedSnapshot('alertas')) {
        renderPlaneacionesSurface({
          includeStats,
          includePlaneaciones,
          includeAlertas: true
        });
        return Promise.resolve();
      }
      if (!options.force && state.ui && state.ui.deferredPlaneacionesAlertRefreshPromise) {
        return state.ui.deferredPlaneacionesAlertRefreshPromise;
      }
      if (options.force) {
        const immediateTask = (async () => {
          try {
            await refreshAlertas({ force: true });
            renderPlaneacionesSurface({
              includeStats,
              includePlaneaciones,
              includeAlertas: true
            });
          } finally {
            if (state.ui) state.ui.deferredPlaneacionesAlertRefreshPromise = null;
          }
        })();
        if (state.ui) state.ui.deferredPlaneacionesAlertRefreshPromise = immediateTask;
        return immediateTask;
      }
      const task = scheduleAfterPaint(async () => {
        try {
          await refreshAlertas({ force: !!options.force });
          renderPlaneacionesSurface({
            includeStats,
            includePlaneaciones,
            includeAlertas: true
          });
        } finally {
          if (state.ui) state.ui.deferredPlaneacionesAlertRefreshPromise = null;
        }
      }, delay);
      if (state.ui) state.ui.deferredPlaneacionesAlertRefreshPromise = task;
      return task;
    }

    function planDraftAffectsMaterialAlerts(draftLike) {
      return !!(
        draftLike &&
        Array.isArray(draftLike.activities) &&
        draftLike.activities.some((activity) => {
          const status = normalizeMaterialStatus((activity && activity.material_en_carpeta) || 'no_requiere');
          return status === 'no_listo' || status === 'listo';
        })
      );
    }

    function didOpenPlanMaterialStateChange(plan, request) {
      if (!plan || !request) return true;
      const currentActivities = Array.isArray(plan.actividades) ? plan.actividades : [];
      const nextActivities = Array.isArray(request.actividades) ? request.actividades : [];
      if (!currentActivities.length || currentActivities.length !== nextActivities.length) return true;
      const currentMaterialConfirmado = String(plan.material_confirmado || '').trim().toLowerCase() === 'si';
      const nextMaterialConfirmado = nextActivities.every((activity) =>
        normalizeMaterialStatus((activity && activity.material_en_carpeta) || 'no_requiere') !== 'no_listo'
      );
      if (currentMaterialConfirmado !== nextMaterialConfirmado) return true;
      return currentActivities.some((activity, index) => {
        const currentStatus = normalizeMaterialStatus((activity && activity.material_en_carpeta) || 'no_requiere');
        const nextStatus = normalizeMaterialStatus((nextActivities[index] && nextActivities[index].material_en_carpeta) || 'no_requiere');
        return currentStatus !== nextStatus;
      });
    }

    function didOpenPlanActivityProgressChange(plan, request) {
      if (!plan || !request) return true;
      const currentActivities = Array.isArray(plan.actividades) ? plan.actividades : [];
      const nextActivities = Array.isArray(request.actividades) ? request.actividades : [];
      if (!currentActivities.length || currentActivities.length !== nextActivities.length) return true;
      return currentActivities.some((activity, index) => {
        const nextActivity = nextActivities[index] || {};
        return normalizeRealizadaStatus((activity && activity.realizada) || '') !== normalizeRealizadaStatus(nextActivity.realizada || '') ||
          normalizeMaterialStatus((activity && activity.material_en_carpeta) || 'no_requiere') !== normalizeMaterialStatus(nextActivity.material_en_carpeta || 'no_requiere') ||
          String((activity && activity.comentario_cierre) || '').trim() !== String(nextActivity.comentario_cierre || '').trim();
      });
    }

    async function persistOpenPlanDraftApi(planId, draft, providedPlan, providedRequest) {
      const plan = providedPlan || getPlanById(planId);
      if (!plan || !draft) throw new Error('Planeaci\u00f3n no encontrada.');
      const request = providedRequest || buildOpenPlanSaveRequest(plan, draft);
      const shouldUseLiteSave = shouldUseLightOpenPlanSave(plan, draft, request);
      const trackingChanged = didOpenPlanActivityProgressChange(plan, request);
      const activitiesUnchanged = shouldUseLiteSave && draft.activitiesDirty !== true && !trackingChanged;
      const activitiesChanged = shouldUseLiteSave && (draft.activitiesDirty === true || trackingChanged);
      const payload = {
        planeacion_id: planId,
        fecha_planeacion: draft.fecha_planeacion || request.fallbackDate,
        semana_id: request.semana.draft ? '' : request.semana.semana_id,
        grupo_id: plan.grupo_id,
        materia_id: request.materiaId,
        submateria_id: request.submateriaId,
        taller_id: request.tallerId,
        frase_semana: String(draft.frase_semana || '').trim(),
        alumnos_ids: request.alumnosIds,
        actividades: request.actividades,
        activities_unchanged: activitiesUnchanged,
        activities_changed: activitiesChanged,
        last_known_updated_at: draft.lastKnownUpdatedAt || plan.fecha_actualizacion || '',
        last_known_activities_version: draft.lastKnownActivitiesVersion || plan.actividades_version_actual || '',
        skip_material_sync: !didOpenPlanMaterialStateChange(plan, request),
        minimal_response: shouldUseLiteSave,
        request_id: uid('PLAOPEN')
      };
      return await performOpenPlanSaveRequest(
        shouldUseLiteSave ? 'guardarPlaneacionLigera' : 'guardarPlaneacionCompleta',
        payload
      );
    }

    function hasActivePlaneacionesFilters() {
      return !!(
        ($('filterSemana') && $('filterSemana').value) ||
        ($('filterEstado') && $('filterEstado').value) ||
        ($('filterGrupo') && $('filterGrupo').value) ||
        ($('filterFacilitador') && $('filterFacilitador').value) ||
        ($('filterAlumnoId') && $('filterAlumnoId').value) ||
        (state.ui && state.ui.planeacionesMateriaFilter)
      );
    }

    function shouldRefetchPlaneacionesAfterPlanSave(previousPlan, updatedPlan) {
      if (!previousPlan || !updatedPlan) return true;
      if (hasActivePlaneacionesFilters()) return true;
      return ['semana_id', 'grupo_id', 'materia_id', 'submateria_id', 'taller_id', 'estado', 'facilitador_id'].some((field) => {
        return String(previousPlan[field] || '') !== String(updatedPlan[field] || '');
      });
    }

    function applySavedPlaneacionDetail(planId, updatedPlan, options = {}) {
      if (!updatedPlan || !updatedPlan.planeacion_id) return;
      const normalizedPlanId = String(planId || '').trim();
      const wasStillOpen = String(state.openPlanId || '').trim() === normalizedPlanId;
      const mergedPlan = upsertPlaneacionRow(updatedPlan) || updatedPlan;
      if (options.preserveUserOpenState && !wasStillOpen) {
        return;
      }
      state.openPlanId = normalizedPlanId;
      state.openPlanDraft = preserveOpenPlanDraftLocalNotes(normalizedPlanId, buildOpenPlanDraft(mergedPlan), mergedPlan);
      if (options.clearGeneralDraft && state.openPlanDraft) {
        state.openPlanDraft.generalObservationText = '';
        state.openPlanDraft.generalObservationDirty = false;
      }
    }

    function applyOptimisticPlanPatch(planId, patch = {}, options = {}) {
      const normalizedPlanId = String(planId || '').trim();
      if (!normalizedPlanId) return null;
      const currentPlan = getPlanById(normalizedPlanId);
      if (!currentPlan) return null;
      const patchValue = typeof patch === 'function' ? (patch(currentPlan) || {}) : (patch || {});
      const nextPlan = Object.assign({}, currentPlan, patchValue);
      if (options.localState !== undefined) nextPlan._local_save_state = String(options.localState || '').trim();
      if (options.localMessage !== undefined) nextPlan._local_save_message = String(options.localMessage || '').trim();
      const appliedPlan = upsertPlaneacionRow(nextPlan) || nextPlan;
      if (options.forceLocalMaterialAlerts) injectLocalMaterialAlerts(appliedPlan);
      if (options.closeOpenCard) {
        state.openPlanId = '';
        state.openPlanDraft = null;
      } else if (state.openPlanId === normalizedPlanId && options.preserveOpenDraft !== false) {
        const currentDraft = state.openPlanDraft &&
          String(state.openPlanDraft.planId || '').trim() === normalizedPlanId
          ? cloneJsonSafe(state.openPlanDraft, state.openPlanDraft)
          : null;
        if (currentDraft) {
          state.openPlanDraft = syncOpenPlanDraftConcurrencyHints(
            appliedPlan,
            preserveOpenPlanDraftLocalNotes(normalizedPlanId, currentDraft, appliedPlan)
          );
        } else if (appliedPlan.detail_loaded) {
          state.openPlanDraft = preserveOpenPlanDraftLocalNotes(
            normalizedPlanId,
            buildOpenPlanDraft(appliedPlan),
            appliedPlan
          );
        }
      }
      persistCurrentBootSnapshot(options.snapshotKind || 'planeacion_optimistic_patch');
      if (options.render !== false) renderPlaneacionesList();
      return appliedPlan;
    }

    async function applySavedPlaneacionTransition(planId, updatedPlan, options = {}) {
      if (!updatedPlan || !updatedPlan.planeacion_id) return false;
      upsertPlaneacionRow(updatedPlan);
      if (options.closeOpenCard) {
        state.openPlanId = '';
        state.openPlanDraft = null;
      } else if (state.openPlanId === planId) {
        const refreshedPlan = Object.assign({}, getPlanById(planId) || updatedPlan);
        state.openPlanDraft = preserveOpenPlanDraftLocalNotes(planId, buildOpenPlanDraft(refreshedPlan), refreshedPlan);
      }
      persistCurrentBootSnapshot('planeacion_transition_local');
      await refreshAlertas();
      renderPlaneacionesSurface();
      return true;
    }

    function buildMultiGroupSharedSavePayload(entry, draft) {
      if (!entry || !entry.isMulti) throw new Error('Planeaci\u00f3n multigrupo no encontrada.');
      if (!draft) throw new Error('No se pudo preparar la base multigrupo.');
      const selectedPlan = getOpenPlaneacionEntry(entry) || entry.representative || null;
      const fallbackDate = getWeekStartDateForPlan(selectedPlan);
      const semana = resolveWeekForPlanDate(selectedPlan, draft.fecha_planeacion || fallbackDate);
      if (!semana) throw new Error('Selecciona una fecha v\u00e1lida para el multigrupo.');
      const materiaId = String((draft && draft.materia_id) || (selectedPlan && selectedPlan.materia_id) || '').trim();
      if (!materiaId) throw new Error('Selecciona una materia.');
      const submateriaId = String(((draft && draft.submateria_id) || '')).trim();
      if (materiaRequiresPlanSubmateria(materiaId) && !submateriaId) {
        throw new Error('Selecciona una submateria.');
      }
      const activities = (draft.activities || [])
        .map((activity) => ({
          texto: String((activity && activity.texto) || '').trim(),
          material_en_carpeta: normalizeMaterialStatus((activity && activity.material_en_carpeta) || 'no_requiere'),
          realizada: normalizeRealizadaStatus((activity && activity.realizada) || ''),
          comentario_cierre: String((activity && activity.comentario_cierre) || '').trim()
        }))
        .filter((activity) => activity.texto);
      if (!activities.length) throw new Error('Captura al menos una actividad compartida.');
      return {
        planeacion_lote_id: draft.loteId,
        planeacion_base_id: (selectedPlan && selectedPlan.planeacion_id) || draft.basePlanId,
        fecha_planeacion: draft.fecha_planeacion || fallbackDate,
        semana_id: semana.draft ? '' : semana.semana_id,
        materia_id: materiaId,
        submateria_id: submateriaId,
        taller_id: String((draft && draft.taller_id) || (selectedPlan && selectedPlan.taller_id) || '').trim(),
        frase_semana: String(draft.frase_semana || '').trim(),
        actividades: activities,
        planes: (entry.plans || []).map((plan) => ({
          planeacion_id: plan.planeacion_id,
          last_known_updated_at: plan.fecha_actualizacion || '',
          last_known_activities_version: plan.actividades_version_actual || ''
        })),
        request_id: uid('PLMG')
      };
    }

    async function persistMultiGroupSharedApi(entry, draft) {
      const payload = buildMultiGroupSharedSavePayload(entry, draft);
      await api('guardarPlaneacionMultigrupo', payload);
    }

    async function savePlanChanges(button, planId, entryKey) {
      const plan = getPlanById(planId);
      if (!plan) throw new Error('Planeaci\u00f3n no encontrada.');
      const entry = entryKey ? getPlaneacionEntryByKey(entryKey) : null;
      const saveTrace = beginSaveTrace('guardarCambiosPlaneacion', {
        planId: String(planId || '').trim(),
        entryKey: String(entryKey || '').trim(),
        isMultiEntry: !!(entry && entry.isMulti),
        estado: String(plan.estado || '').trim(),
        detailLoaded: !!plan.detail_loaded,
        openPlanId: String(state.openPlanId || '').trim()
      });
      if (!isOpenPlanReadyForSave(plan, entry)) {
        markSaveTrace(saveTrace, 'not_ready');
        endSaveTrace(saveTrace, 'skipped_not_ready');
        setBanner('La planeaci\u00f3n todav\u00eda se est\u00e1 abriendo. Espera un momento antes de guardar.', 'info', { button });
        renderPlaneacionesList();
        return;
      }
      markSaveTrace(saveTrace, 'ready_for_save');
      const planCard = $('plan-card-' + planId);
      const hasPlanEditor = !!(planCard && planCard.querySelector('.plan-open-editor'));
      const hasSharedEditor = !!(planCard && planCard.querySelector('.plan-multigroup-shared'));
      const saveButtonScrollAnchor = captureScrollAnchor(button, 'plan-save-' + planId);
      const saveViewportScrollAnchor = captureViewportScrollAnchor();
      let useViewportScrollAnchorAfterSave = false;
      const restoreSaveScrollAnchor = () => restoreScrollAnchor(
        useViewportScrollAnchorAfterSave ? saveViewportScrollAnchor : saveButtonScrollAnchor
      );
      const restoreSaveScrollAnchorAfterLayout = () => {
        restoreSaveScrollAnchor();
        window.setTimeout(restoreSaveScrollAnchor, 0);
        window.setTimeout(restoreSaveScrollAnchor, 120);
      };
      const generalText = getPendingGeneralObservationText(planId);
      const finalPayloads = collectPendingAlumnoFinalObservations(planId, plan, entry);
      if (!finalPayloads.length) {
        finalPayloads.push(...collectStoredAlumnoFinalObservations(planId, plan, entry));
      }
      const currentDraft = hasPlanEditor ? getOpenPlanDraft(plan) : null;
      const planDraft = currentDraft
        ? syncOpenPlanDraftFromVisibleControls(
            syncOpenPlanDraftConcurrencyHints(plan, JSON.parse(JSON.stringify(currentDraft)))
          )
        : null;
      const sharedDraft = hasSharedEditor && entry && entry.isMulti ? JSON.parse(JSON.stringify(getMultiGroupSharedDraft(entry) || null)) : null;
      const shouldSavePlanDraft = !!planDraft;
      const shouldSaveShared = !!(sharedDraft && entry && entry.isMulti && didMultiGroupSharedDraftChange(entry, sharedDraft));
      let planSaveRequest = null;
      let openPlanStructureChanged = false;
      let shouldPersistOpenPlanActivities = false;
      let shouldRefreshMaterialAlertas = false;
      try {
        planSaveRequest = shouldSavePlanDraft ? buildOpenPlanSaveRequest(plan, planDraft) : null;
        openPlanStructureChanged = shouldSavePlanDraft
          ? buildOpenPlanStructuralSignatureFromDraft(planDraft) !== buildOpenPlanStructuralSignatureFromPlan(plan)
          : false;
        shouldPersistOpenPlanActivities = shouldSavePlanDraft
          ? (planDraft.activitiesDirty === true || didOpenPlanActivityProgressChange(plan, planSaveRequest))
          : false;
        shouldRefreshMaterialAlertas = shouldSavePlanDraft
          ? didOpenPlanMaterialStateChange(plan, planSaveRequest)
          : false;
      } catch (err) {
        markSaveTrace(saveTrace, 'request_validation_error', {
          code: err && err.code || '',
          message: err && err.message || String(err || '')
        });
        if (showInlineFieldValidationError(err) || showPlanEditorValidationError(err)) {
          endSaveTrace(saveTrace, 'validation_error');
          return;
        }
        throw err;
      }
      const shouldSavePlan = shouldSavePlanDraft && (
        openPlanStructureChanged ||
        shouldPersistOpenPlanActivities ||
        shouldRefreshMaterialAlertas
      );
      useViewportScrollAnchorAfterSave = !shouldSavePlan && !shouldSaveShared;
      const shouldForceAlertasAfterSave =
        (shouldSavePlan && shouldRefreshMaterialAlertas && planDraftAffectsMaterialAlerts(planDraft)) ||
        (shouldSaveShared && planDraftAffectsMaterialAlerts(sharedDraft));
      markSaveTrace(saveTrace, 'drafts_collected', {
        hasPlanEditor,
        hasSharedEditor,
        generalObservation: !!generalText,
        finalObservationCount: finalPayloads.length,
        shouldSavePlan,
        shouldSaveShared,
        openPlanStructureChanged,
        shouldPersistOpenPlanActivities,
        shouldRefreshMaterialAlertas
      });
      const previousPlanSnapshot = cloneJsonSafe(plan, plan);
      const canOptimisticallyRenderMultiObservationOnly = !!(
        entry && entry.isMulti &&
        (generalText || finalPayloads.length) &&
        !shouldSavePlan
      );
      const canOptimisticallyRender = !shouldSaveShared && (
        !(entry && entry.isMulti) ||
        canOptimisticallyRenderMultiObservationOnly
      );
      const shouldUsePlaneacionOutbox = !canUseAdminShell() && canOptimisticallyRender && !shouldSaveShared && isPlaneacionOutboxEnabled();
      const shouldUseLiteSave = !!(shouldSavePlan && shouldUseLightOpenPlanSave(plan, planDraft, planSaveRequest));
      const outboxDraft = shouldSavePlan
        ? buildOpenPlanDraftWithPendingObservations(planDraft, generalText, finalPayloads)
        : null;
      const displayOutboxDraft = outboxDraft
        ? Object.assign({}, outboxDraft, { generalObservationText: '' })
        : null;
      applyPendingPlanObservationDraft(planId, generalText, finalPayloads);
      markSaveTrace(saveTrace, 'pending_observations_applied');
      const combinedSaveRequest = buildPlanSaveTransactionBundle({
        planId,
        generalText,
        finalPayloads,
        planSaveAction: shouldSavePlan
          ? (shouldUseLiteSave ? 'guardarPlaneacionLigera' : 'guardarPlaneacionCompleta')
          : '',
        planSavePayload: shouldSavePlan ? {
          planeacion_id: planId,
          fecha_planeacion: planDraft.fecha_planeacion || planSaveRequest.fallbackDate,
          semana_id: planSaveRequest.semana.draft ? '' : planSaveRequest.semana.semana_id,
          grupo_id: plan.grupo_id,
          materia_id: planSaveRequest.materiaId,
          submateria_id: planSaveRequest.submateriaId,
          taller_id: planSaveRequest.tallerId,
          frase_semana: String(planDraft.frase_semana || '').trim(),
          alumnos_ids: planSaveRequest.alumnosIds,
          actividades: planSaveRequest.actividades,
          activities_unchanged: shouldUseLiteSave && !shouldPersistOpenPlanActivities,
          activities_changed: shouldUseLiteSave && shouldPersistOpenPlanActivities,
          last_known_updated_at: planDraft.lastKnownUpdatedAt || plan.fecha_actualizacion || '',
          last_known_activities_version: planDraft.lastKnownActivitiesVersion || plan.actividades_version_actual || '',
          skip_material_sync: !didOpenPlanMaterialStateChange(plan, planSaveRequest),
          minimal_response: shouldUseLiteSave
        } : null
      });
      const optimisticPlan = canOptimisticallyRender
        ? buildOptimisticPlaneacionSavePreview(plan, {
            draft: shouldSavePlan ? planDraft : null,
            generalText,
            finalPayloads,
            localState: 'saving_silent',
            localMessage: '',
            clearGeneralDraft: true
          })
        : null;
      markSaveTrace(saveTrace, 'request_built', {
        shouldUsePlaneacionOutbox,
        shouldUseLiteSave,
        hasOptimisticPlan: !!optimisticPlan,
        transactionId: combinedSaveRequest && combinedSaveRequest.transaction_id || '',
        planSaveAction: shouldSavePlan ? (shouldUseLiteSave ? 'guardarPlaneacionLigera' : 'guardarPlaneacionCompleta') : ''
      });
      if (!generalText && !finalPayloads.length && !shouldSavePlan && !shouldSaveShared) {
        endSaveTrace(saveTrace, 'skipped_no_changes');
        throw new Error('No hay cambios para guardar.');
      }

      markSaveTrace(saveTrace, 'handleAction_start');
      try {
        await handleAction('guardarCambiosPlaneacion', async () => {
        markSaveTrace(saveTrace, 'handleAction_callback_start');
        if (optimisticPlan) {
          markSaveTrace(saveTrace, 'optimistic_render_start');
          upsertPlaneacionRow(optimisticPlan);
          state.openPlanId = planId;
          state.openPlanDraft = buildOpenPlanDraft(optimisticPlan);
          persistCurrentBootSnapshot('guardar_cambios_optimistic');
          renderPlaneacionesSurface({
            includeStats: true,
            includePlaneaciones: true,
            includeAlertas: false
          });
          restoreSaveScrollAnchor();
          markSaveTrace(saveTrace, 'optimistic_render_done');
        }
        if (shouldUsePlaneacionOutbox) {
          markSaveTrace(saveTrace, 'outbox_enqueue_start');
          enqueuePlaneacionOutboxItem(buildPlaneacionOutboxItem('open_save', {
            mergeKey: 'plan:' + String(planId || '').trim(),
            planId: String(planId || '').trim(),
            previousPlanSnapshot,
            optimisticPlan,
            draft: displayOutboxDraft,
            shouldSavePlan,
            shouldSaveShared: false,
            shouldRefreshMaterialAlertas,
            shouldForceAlertasAfterSave,
            combinedRequest: combinedSaveRequest,
            localState: 'saving_silent',
            localMessage: '',
            planSaveAction: shouldUseLiteSave ? 'guardarPlaneacionLigera' : 'guardarPlaneacionCompleta',
            requests: {
              generalObservation: generalText ? {
                planeacion_id: planId,
                texto: generalText,
                request_id: combinedSaveRequest && combinedSaveRequest.general_observation
                  ? combinedSaveRequest.general_observation.request_id
                  : uid('OSG')
              } : null,
              finalObservationBatch: finalPayloads.length ? {
                items: finalPayloads.map((row) => ({
                  planeacion_id: row.planId || planId,
                  alumno_id: row.alumnoId,
                  nota: row.nota
                })),
                request_id: combinedSaveRequest && combinedSaveRequest.final_observation_batch
                  ? combinedSaveRequest.final_observation_batch.request_id
                  : uid('OAFL')
              } : null,
              planSave: combinedSaveRequest ? combinedSaveRequest.plan_save : null
            }
          }));
          persistCurrentBootSnapshot('guardar_cambios_outbox_local');
          renderPlaneacionesSurface({
            includeStats: true,
            includePlaneaciones: true,
            includeAlertas: false
          });
          restoreSaveScrollAnchor();
          restorePendingPlanObservationInputs(planId, '', finalPayloads);
          restoreSaveScrollAnchorAfterLayout();
          markSaveTrace(saveTrace, 'outbox_enqueue_done');
          return;
        }

        const savedParts = [];
        let savedPlanResponse = null;
        try {
          markSaveTrace(saveTrace, 'api_composite_start');
          const compositeResponse = await persistPlanChangesCompositeApi(combinedSaveRequest);
          markSaveTrace(saveTrace, 'api_composite_done');
          if (generalText) savedParts.push('observaci\u00f3n general');
          if (finalPayloads.length) savedParts.push('observaciones finales');
          if (shouldSavePlan) {
            savedPlanResponse = compositeResponse && compositeResponse.plan_save
              ? compositeResponse.plan_save
              : (compositeResponse && compositeResponse.planeacion ? { planeacion: compositeResponse.planeacion } : null);
            savedParts.push(entry && entry.isMulti ? 'grupo activo' : 'planeaci\u00f3n');
          }
          if (shouldSaveShared) {
            const freshEntry = getPlaneacionEntryByKey(entryKey) || entry;
            await persistMultiGroupSharedApi(freshEntry, sharedDraft);
            state.multiGroupSharedDrafts[entryKey] = null;
            state.openPlanDraft = null;
            savedParts.push('base multigrupo');
          }
        } catch (err) {
          markSaveTrace(saveTrace, 'api_or_shared_error', {
            code: err && err.code || '',
            message: err && err.message || String(err || '')
          });
          if (optimisticPlan && previousPlanSnapshot) {
            markSaveTrace(saveTrace, 'rollback_render_start');
            upsertPlaneacionRow(previousPlanSnapshot);
            state.openPlanId = planId;
            state.openPlanDraft = buildOpenPlanDraft(previousPlanSnapshot);
            renderPlaneacionesSurface({
              includeStats: true,
              includePlaneaciones: true,
              includeAlertas: false
            });
            restoreSaveScrollAnchor();
            restorePendingPlanObservationInputs(planId, generalText, finalPayloads);
            restoreSaveScrollAnchorAfterLayout();
            markSaveTrace(saveTrace, 'rollback_render_done');
          }
          throw err;
        }

        markSaveTrace(saveTrace, 'post_api_apply_start');
        if (generalText) {
          const generalInput = $('obs-general-' + planId);
          if (generalInput) generalInput.value = '';
        }
        clearPendingPlanSaveTransaction(planId);
        const updatedPlan = savedPlanResponse && savedPlanResponse.planeacion
          ? Object.assign({}, plan, savedPlanResponse.planeacion)
          : null;
        const planWithSavedObservations = mergeSavedObservationPreview(updatedPlan || plan, generalText, finalPayloads, {
          clearGeneralDraft: true
        });
        const inlineSavedPreview = buildInlineSavedPlaneacionPreview(
          plan,
          optimisticPlan,
          planWithSavedObservations,
          {
            localState: 'saved',
            localMessage: 'Cambios guardados.'
          }
        );
        const canPatchSimplePlanLocally = shouldSavePlan &&
          !shouldSaveShared &&
          !(entry && entry.isMulti);
        if (canPatchSimplePlanLocally && !shouldRefetchPlaneacionesAfterPlanSave(plan, updatedPlan)) {
          markSaveTrace(saveTrace, 'local_patch_start');
          applySavedPlaneacionDetail(planId, inlineSavedPreview || Object.assign({}, planWithSavedObservations, {
            _local_save_state: 'saved',
            _local_save_message: 'Cambios guardados.'
          }), { clearGeneralDraft: !!generalText });
          persistCurrentBootSnapshot('guardar_cambios_local');
          renderPlaneacionesList();
          restoreSaveScrollAnchor();
          restorePendingPlanObservationInputs(planId, '', finalPayloads);
          restoreSaveScrollAnchorAfterLayout();
          scheduleClearLocalPlaneacionFeedback(planId);
          if (shouldSavePlan) {
            queuePlaneacionPostSaveSync(planId, {
              refreshDetail: false,
              refreshObservaciones: false,
              refreshAlertas: shouldRefreshMaterialAlertas,
              forceAlertas: shouldForceAlertasAfterSave
            });
          }
          markSaveTrace(saveTrace, 'local_patch_done');
        } else if (!shouldSavePlan && !shouldSaveShared) {
          markSaveTrace(saveTrace, 'observations_local_patch_start');
          applySavedPlaneacionDetail(planId, Object.assign({}, planWithSavedObservations, {
            _local_save_state: 'saved',
            _local_save_message: 'Cambios guardados.'
          }), { clearGeneralDraft: !!generalText });
          persistCurrentBootSnapshot('guardar_cambios_obs_local');
          renderPlaneacionesList();
          restoreSaveScrollAnchor();
          restorePendingPlanObservationInputs(planId, '', finalPayloads);
          restoreSaveScrollAnchorAfterLayout();
          scheduleClearLocalPlaneacionFeedback(planId);
          queuePlaneacionPostSaveSync(planId, {
            refreshDetail: true,
            refreshObservaciones: true,
            refreshAlertas: false,
            snapshotKind: 'guardar_cambios_obs'
          });
          markSaveTrace(saveTrace, 'observations_local_patch_done');
        } else {
          markSaveTrace(saveTrace, 'refresh_surface_start');
          state.openPlanId = shouldSavePlan ? planId : state.openPlanId;
          if (!shouldSavePlan) state.openPlanDraft = null;
          await refreshPlaneacionesSurface({ includeAlertas: false });
          restoreSaveScrollAnchor();
          const restoredDraftAfterRefresh = shouldSavePlan &&
            restoreOpenPlanDraftAfterSaveRefresh(planId, displayOutboxDraft, '', finalPayloads);
          if (!restoredDraftAfterRefresh) {
            restorePendingPlanObservationInputs(planId, '', finalPayloads);
            restoreSaveScrollAnchorAfterLayout();
          } else {
            restoreSaveScrollAnchor();
          }
          if (shouldSavePlan || shouldSaveShared) {
            refreshPlaneacionesAlertsDeferred({
              force: shouldForceAlertasAfterSave,
              includeStats: false,
              includePlaneaciones: false
            }).catch(() => {});
          }
          markSaveTrace(saveTrace, 'refresh_surface_done');
        }
        finalPayloads.forEach((row) => {
          const input = $('obs-final-' + (row.planId || planId) + '-' + row.alumnoId);
          if (input) autoGrowObsFinal(input);
        });
        markSaveTrace(saveTrace, 'handleAction_callback_done', {
          savedParts: savedParts.join(', ')
        });
        }, {
          button,
          key: buildActionKey('guardarCambiosPlaneacion', [planId, entryKey || '', generalText.slice(0, 40), finalPayloads.map((row) => row.alumnoId).join(','), shouldSavePlan ? 'plan' : '', shouldSaveShared ? 'multi' : '']),
          busyText: 'Guardando...'
        });
        endSaveTrace(saveTrace, 'success');
      } catch (err) {
        endSaveTrace(saveTrace, 'error', {
          code: err && err.code || '',
          message: err && err.message || String(err || '')
        });
        throw err;
      }
    }

    async function markPlanMaterialReady(button, planId) {
      if (!window.confirm('Esto marcará como listo el material pendiente de esta planeación.')) return;
      const plan = getPlanById(planId);
      if (!plan) throw new Error('Planeaci\u00f3n no encontrada.');
      if (isPlaneacionBlockedForActions(plan)) {
        notifyPlaneacionStillSyncing(button);
        return;
      }
      const entry = getPlaneacionEntryByKey(getPlaneacionEntryKey(plan));
      if (entry && entry.isMulti) {
        const draft = getMultiGroupSharedDraft(entry);
        if (!draft) throw new Error('Planeaci\u00f3n multigrupo no encontrada.');
        const pendingActivities = (draft.activities || []).filter((activity) => normalizeMaterialStatus(activity.material_en_carpeta) === 'no_listo');
        if (!pendingActivities.length) {
          setBanner('Ya no hay material pendiente en esta planeaci\u00f3n multigrupo.', 'info', { button });
          return;
        }
        pendingActivities.forEach((activity) => {
          activity.material_en_carpeta = 'listo';
        });
        await handleAction('marcarMaterialListoMultigrupo', async () => {
          await persistMultiGroupSharedApi(entry, draft);
          state.multiGroupSharedDrafts[entry.key] = null;
          state.openPlanDraft = null;
          await refreshPlaneacionesSurface();
          setBanner('Material compartido marcado como listo.', 'success');
        }, {
          button,
          key: buildActionKey('marcarMaterialListoMultigrupo', [entry.key, String(pendingActivities.length)]),
          busyText: 'Marcando...'
        });
        return;
      }
      const draft = syncOpenPlanDraftFromVisibleControls(getOpenPlanDraft(plan));
      if (!draft) throw new Error('Planeaci\u00f3n no encontrada.');
      const pendingActivities = (draft.activities || []).filter((activity) => normalizeMaterialStatus(activity.material_en_carpeta) === 'no_listo');
      if (!pendingActivities.length) {
        setBanner('Ya no hay material pendiente en esta planeaci\u00f3n.', 'info', { button });
        return;
      }
      const previousPlanSnapshot = cloneJsonSafe(plan, plan);
      const previousDraftSnapshot = state.openPlanDraft &&
        String(state.openPlanDraft.planId || '').trim() === String(planId || '').trim()
        ? cloneJsonSafe(state.openPlanDraft, state.openPlanDraft)
        : null;
      const previousAlertasSnapshot = cloneJsonSafe(state.alertas, state.alertas) || [];
      const readyDraft = buildMaterialReadyDraft(draft);
      const readyPatch = buildMaterialReadyPlanPatch(plan, readyDraft);
      await handleAction('marcarMaterialListo', async () => {
        // buildOpenPlanSaveRequest puede lanzar createInlineFieldValidationError;
        // debe ejecutarse dentro de handleAction para que su catch lo intercepte.
        const request = buildOpenPlanSaveRequest(plan, readyDraft);
        state.openPlanDraft = readyDraft;
        applyOptimisticPlanPatch(planId, readyPatch, {
          localState: 'syncing',
          localMessage: 'Sincronizando material...',
          snapshotKind: 'material_ready_local',
          render: false
        });
        hideOpenMaterialAlertsForPlan(planId);
        renderPlaneacionesSurface({
          includeStats: false,
          includePlaneaciones: true,
          includeAlertas: true
        });
        let response = null;
        try {
          response = await persistOpenPlanDraftApi(planId, readyDraft, plan, request);
        } catch (err) {
          if (previousPlanSnapshot) upsertPlaneacionRow(previousPlanSnapshot);
          if (state.openPlanId === planId) {
            state.openPlanDraft = previousDraftSnapshot;
          }
          state.alertas = previousAlertasSnapshot;
          markAlertasFresh();
          persistCurrentBootSnapshot('material_ready_revertida');
          renderPlaneacionesSurface({
            includeStats: false,
            includePlaneaciones: true,
            includeAlertas: true
          });
          throw err;
        }
        const updatedPlan = response && response.planeacion
          ? Object.assign({}, getPlanById(planId) || plan, response.planeacion)
          : null;
        applyOptimisticPlanPatch(planId, Object.assign({}, readyPatch, updatedPlan || {}, {
          material_confirmado: 'si'
        }), {
          localState: '',
          localMessage: '',
          snapshotKind: 'material_ready_confirmed',
          render: false
        });
        renderPlaneacionesSurface({
          includeStats: false,
          includePlaneaciones: true,
          includeAlertas: true
        });
        refreshPlaneacionesAlertsDeferred({
          force: true,
          includeStats: false,
          includePlaneaciones: false
        }).catch(() => {});
        setBanner('Material marcado como listo.', 'success');
      }, {
        button,
        key: buildActionKey('marcarMaterialListo', [planId, String(pendingActivities.length)]),
        busyText: 'Sincronizando...'
      });
    }

    async function approvePlan(button, planId) {
      await handleAction('aprobarPlaneacionPendiente', async () => {
        await api('aprobarPlaneacionPendiente', { planeacion_id: planId, request_id: uid('APP') });
        await refreshPlaneacionesSurface();
        setBanner('Planeaci\u00f3n aprobada.', 'success');
      }, { button, key: buildActionKey('aprobarPlaneacionPendiente', [planId]) });
    }

    async function rejectPlan(button, planId) {
      const comentario = window.prompt('Escribe el comentario de rechazo:', '') || '';
      if (!comentario.trim()) throw new Error('El rechazo necesita comentario.');
      await handleAction('rechazarPlaneacionPendiente', async () => {
        await api('rechazarPlaneacionPendiente', {
          planeacion_id: planId,
          comentario: comentario.trim(),
          request_id: uid('REJ')
        });
        await refreshPlaneacionesSurface();
        setBanner('Planeaci\u00f3n rechazada.', 'success');
      }, { button, key: buildActionKey('rechazarPlaneacionPendiente', [planId, comentario.trim().slice(0, 30)]) });
    }

    async function resubmitPlan(button, planId) {
      await handleAction('reenviarPlaneacionPendiente', async () => {
        await api('reenviarPlaneacionPendiente', { planeacion_id: planId, request_id: uid('REAPP') });
        await refreshPlaneacionesSurface();
        setBanner('Planeaci\u00f3n reenviada a aprobaci\u00f3n.', 'success');
      }, { button, key: buildActionKey('reenviarPlaneacionPendiente', [planId]) });
    }

    function openClosePlanModal(planId) {
      const modal = $('closePlanModal');
      const input = $('closePlanObsInput');
      if (!modal || !input) return;
      modal.dataset.planId = planId;
      modal.hidden = false;
      input.value = '';
      const syncBlock = syncClosePlanModalState(planId);
      if (syncBlock && syncBlock.kind === 'syncing') {
        scheduleClosePlanSyncWatch(planId);
      }
      window.requestAnimationFrame(() => input.focus());
    }

    function closeClosePlanModal() {
      const modal = $('closePlanModal');
      const input = $('closePlanObsInput');
      if (!modal) return;
      clearClosePlanSyncWatchTimer();
      modal.hidden = true;
      modal.dataset.planId = '';
      if (input) input.value = '';
      clearClosePlanModalError();
      setClosePlanConfirmBlocked(null);
    }

    function setClosePlanModalError(message) {
      const errorBox = $('closePlanModalError');
      if (!errorBox) return;
      const text = String(message || '').trim();
      errorBox.textContent = text;
      errorBox.hidden = !text;
    }

    function clearClosePlanModalError() {
      const errorBox = $('closePlanModalError');
      if (!errorBox) return;
      errorBox.textContent = '';
      errorBox.hidden = true;
    }

    function clearClosePlanSyncWatchTimer() {
      if (!state.ui || !state.ui.closePlanSyncWatchTimer) return;
      window.clearTimeout(state.ui.closePlanSyncWatchTimer);
      state.ui.closePlanSyncWatchTimer = null;
    }

    function getClosePlanSyncBlock(planId) {
      const normalizedPlanId = String(planId || '').trim();
      if (!normalizedPlanId) return null;
      const plan = getPlanById(normalizedPlanId);
      const localState = getPlanLocalSaveState(plan);
      if (hasPendingPlaneacionOutboxForPlan(normalizedPlanId) || ['creating', 'saving', 'activating', 'syncing'].includes(localState)) {
        return {
          kind: 'syncing',
          message: 'Sincronizando cambios antes de cerrar la semana.',
          buttonText: 'Sincronizando cambios...'
        };
      }
      if (localState === 'sync_error') {
        return {
          kind: 'error',
          message: 'Hay cambios pendientes de sincronizar. Revisa Guardar cambios antes de cerrar.',
          buttonText: 'Pendiente de sincronizar'
        };
      }
      return null;
    }

    function setClosePlanConfirmBlocked(block) {
      const button = $('closePlanConfirmBtn');
      if (!button) return;
      if (block) {
        if (!button.dataset.originalText) button.dataset.originalText = button.textContent;
        if (!button.dataset.originalWidth) button.dataset.originalWidth = String(button.offsetWidth || 0);
        if (button.offsetWidth) button.style.width = button.offsetWidth + 'px';
        button.disabled = true;
        button.setAttribute('aria-disabled', 'true');
        if (block.kind === 'syncing') button.setAttribute('aria-busy', 'true');
        else button.removeAttribute('aria-busy');
        button.textContent = block.buttonText;
        return;
      }
      setButtonBusy(button, false);
      button.removeAttribute('aria-disabled');
      button.removeAttribute('aria-busy');
    }

    function syncClosePlanModalState(planId) {
      const block = getClosePlanSyncBlock(planId);
      setClosePlanConfirmBlocked(block);
      if (block) {
        setClosePlanModalError(block.message);
      } else {
        clearClosePlanModalError();
      }
      return block;
    }

    function scheduleClosePlanSyncWatch(planId) {
      clearClosePlanSyncWatchTimer();
      if (!state.ui) return;
      const normalizedPlanId = String(planId || '').trim();
      if (!normalizedPlanId) return;
      state.ui.closePlanSyncWatchTimer = window.setTimeout(() => {
        if (state.ui) state.ui.closePlanSyncWatchTimer = null;
        const modal = $('closePlanModal');
        if (!modal || modal.hidden || String(modal.dataset.planId || '').trim() !== normalizedPlanId) return;
        const block = syncClosePlanModalState(normalizedPlanId);
        if (block && block.kind === 'syncing') {
          scheduleClosePlanSyncWatch(normalizedPlanId);
        }
      }, 450);
    }

    function focusPlanCloseField(targetId) {
      const field = targetId ? $(targetId) : null;
      if (!field) return;
      if (typeof field.scrollIntoView === 'function') {
        field.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      if (typeof field.focus === 'function') {
        window.requestAnimationFrame(() => field.focus());
      }
    }

    function buildClosePlanPayload(planId, fallbackPlan) {
      const currentPlan = fallbackPlan || getPlanById(planId);
      if (!currentPlan) throw new Error('Planeación no encontrada.');
      const structuralDraftState = getOpenPlanStructuralDraftState(planId, currentPlan);
      if (structuralDraftState.hasActivitiesWithoutId) {
        throw new Error('Guarda la estructura antes de cerrar la semana.');
      }
      if (structuralDraftState.dirty) {
        throw new Error('Tienes cambios de estructura sin guardar. Guarda antes de cerrar la semana.');
      }
      const draft = syncOpenPlanDraftConcurrencyHints(currentPlan, getOpenPlanDraft(currentPlan));
      const activityRows = Array.isArray(draft && draft.activities) && draft.activities.length
        ? draft.activities
        : (Array.isArray(currentPlan.actividades) ? currentPlan.actividades : []);
      if (!activityRows.length) {
        throw new Error('No puedes cerrar una planeación sin actividades.');
      }
      const actividades = [];
      for (let index = 0; index < activityRows.length; index += 1) {
        const item = activityRows[index];
        const activityLabel = String((item && item.orden) || (index + 1));
        if (!String(item && item.actividad_id || '').trim()) {
          throw new Error('Primero guarda la planeación antes de cerrar la semana.');
        }
        const realizadaFieldId = 'activity-realizada-' + item.actividad_id;
        const materialFieldId = 'activity-material-' + item.actividad_id;
        const comentarioFieldId = 'activity-comment-' + item.actividad_id;
        const realizadaNode = $(realizadaFieldId);
        const materialNode = $(materialFieldId);
        const comentarioNode = $(comentarioFieldId);
        const realizada = realizadaNode ? realizadaNode.value : normalizeRealizadaStatus(item.realizada);
        const material = materialNode ? materialNode.value : normalizeMaterialStatus(item.material_en_carpeta);
        const comentario = comentarioNode ? comentarioNode.value.trim() : String(item.comentario_cierre || '').trim();
        if (!['si', 'no'].includes(realizada)) {
          const error = new Error('Debes confirmar si se realizó la actividad ' + activityLabel + '.');
          error.focusTargetId = realizadaFieldId;
          throw error;
        }
        if (realizada === 'no' && !comentario) {
          const error = new Error('La actividad ' + activityLabel + ' necesita comentario porque no se realizó.');
          error.focusTargetId = comentarioFieldId;
          throw error;
        }
        actividades.push({
          actividad_id: item.actividad_id,
          realizada,
          material_en_carpeta: material,
          comentario_cierre: comentario,
          last_known_updated_at: item.last_known_updated_at || item.fecha_actualizacion || ''
        });
      }
      return { currentPlan, actividades };
    }

    function buildClosePlanPayloads(planId, fallbackPlan) {
      const selectedPayload = buildClosePlanPayload(planId, fallbackPlan);
      const entry = getPlaneacionEntryByPlanId(planId);
      if (!entry || !entry.isMulti) return [selectedPayload];
      const selectedPlanId = String((selectedPayload.currentPlan && selectedPayload.currentPlan.planeacion_id) || planId || '').trim();
      const sourceActivities = selectedPayload.actividades || [];
      const activePlans = (entry.plans || [])
        .filter((plan) => String(plan && plan.estado || '').trim() === 'activa');
      if (activePlans.length <= 1) return [selectedPayload];
      return activePlans.map((targetPlan) => {
        const targetPlanId = String((targetPlan && targetPlan.planeacion_id) || '').trim();
        if (targetPlanId === selectedPlanId) return selectedPayload;
        const targetActivities = Array.isArray(targetPlan && targetPlan.actividades) ? targetPlan.actividades : [];
        if (targetActivities.length < sourceActivities.length) {
          throw new Error('No se pudo preparar el cierre de todos los grupos. Abre la planeacion y espera a que cargue completa.');
        }
        return {
          currentPlan: targetPlan,
          actividades: sourceActivities.map((sourceActivity, index) => {
            const targetActivity = targetActivities[index] || {};
            const targetActivityId = String(targetActivity.actividad_id || '').trim();
            if (!targetActivityId) {
              throw new Error('No se pudo preparar el cierre de todos los grupos. Guarda la planeacion antes de cerrar.');
            }
            return {
              actividad_id: targetActivityId,
              realizada: sourceActivity.realizada,
              material_en_carpeta: sourceActivity.material_en_carpeta,
              comentario_cierre: sourceActivity.comentario_cierre,
              last_known_updated_at: targetActivity.last_known_updated_at || targetActivity.fecha_actualizacion || ''
            };
          })
        };
      });
    }

    function buildClosePlanOptimisticPatch(plan, closePayload, obs) {
      const payloadActivities = new Map((closePayload.actividades || [])
        .map((item) => [String((item && item.actividad_id) || '').trim(), item])
        .filter((entry) => entry[0]));
      const actividades = Array.isArray(plan && plan.actividades)
        ? plan.actividades.map((activity) => {
            const activityId = String((activity && activity.actividad_id) || '').trim();
            const payloadActivity = payloadActivities.get(activityId);
            return payloadActivity
              ? Object.assign({}, activity, {
                  realizada: payloadActivity.realizada,
                  material_en_carpeta: payloadActivity.material_en_carpeta,
                  comentario_cierre: payloadActivity.comentario_cierre
                })
              : activity;
          })
        : [];
      return {
        estado: 'cerrada',
        actividades,
        _local_close_obs: String(obs || '').trim(),
        fecha_actualizacion: String((plan && plan.fecha_actualizacion) || '').trim()
      };
    }

    async function confirmClosePlan(button, planId) {
      let plan = getPlanById(planId);
      if (!plan) throw new Error('Planeaci\u00f3n no encontrada.');
      if (isPlaneacionBlockedForActions(plan)) {
        notifyPlaneacionStillSyncing(button);
        return;
      }
      if (getClosePlanSyncBlock(planId)) {
        openClosePlanModal(planId);
        return;
      }
      try {
        const entry = getPlaneacionEntryByPlanId(planId);
        if (entry && entry.isMulti) {
          await ensurePlaneacionEntryDetailsLoaded(entry, { silent: true });
          plan = getPlanById(planId) || plan;
        }
        buildClosePlanPayloads(planId, plan);
      } catch (err) {
        focusPlanCloseField(err && err.focusTargetId);
        setBanner(formatApiError(err), 'error', { button });
        return;
      }
      openClosePlanModal(planId);
    }

    async function submitClosePlan(button) {
      const modal = $('closePlanModal');
      const input = $('closePlanObsInput');
      const planId = modal ? String(modal.dataset.planId || '').trim() : '';
      if (!planId) return;
      let plan = getPlanById(planId);
      if (!plan) throw new Error('Planeaci\u00f3n no encontrada.');
      const syncBlock = syncClosePlanModalState(planId);
      if (syncBlock) {
        if (syncBlock.kind === 'syncing') scheduleClosePlanSyncWatch(planId);
        return;
      }
      const obs = input ? input.value.trim() : '';
      clearClosePlanModalError();
      if (!(plan && plan.detail_loaded)) {
        try {
          const refreshedPlan = await ensurePlaneacionDetailLoaded(planId, { silent: true, force: true });
          if (refreshedPlan) {
            plan = refreshedPlan;
            state.openPlanDraft = preserveOpenPlanDraftLocalNotes(
              planId,
              syncOpenPlanDraftConcurrencyHints(refreshedPlan, buildOpenPlanDraft(refreshedPlan)),
              refreshedPlan
            );
          }
        } catch (_) {
          if (['saved', 'sync_error'].includes(getPlanLocalSaveState(plan))) {
            setClosePlanModalError('No se pudo actualizar la planeación antes de cerrar. Intenta guardar una vez más.');
            return;
          }
        }
      }
      const closeEntry = getPlaneacionEntryByPlanId(planId);
      if (closeEntry && closeEntry.isMulti) {
        try {
          await ensurePlaneacionEntryDetailsLoaded(closeEntry, { silent: true });
          plan = getPlanById(planId) || plan;
        } catch (_) {}
      }
      let closePayloads = [];
      try {
        closePayloads = buildClosePlanPayloads(planId, plan);
      } catch (err) {
        setClosePlanModalError(formatApiError(err));
        return;
      }
      const previousPlanSnapshots = closePayloads.map((payload) =>
        cloneJsonSafe(payload.currentPlan, payload.currentPlan)
      );
      const previousDraftSnapshot = state.openPlanDraft
        ? cloneJsonSafe(state.openPlanDraft, state.openPlanDraft)
        : null;
      const previousOpenPlanId = state.openPlanId;
      const targetPlanIds = closePayloads
        .map((payload) => String((payload.currentPlan && payload.currentPlan.planeacion_id) || '').trim())
        .filter(Boolean);
      const shouldCloseOpenCard = targetPlanIds.includes(String(state.openPlanId || '').trim());
      await handleAction('confirmarCierre', async () => {
        closePayloads.forEach((payload) => {
          const targetPlan = payload.currentPlan;
          const targetPlanId = String((targetPlan && targetPlan.planeacion_id) || '').trim();
          if (!targetPlanId) return;
          applyOptimisticPlanPatch(targetPlanId, buildClosePlanOptimisticPatch(targetPlan, payload, obs), {
            localState: 'syncing',
            localMessage: 'Sincronizando cierre...',
            snapshotKind: 'planeacion_cierre_local',
            closeOpenCard: shouldCloseOpenCard && String(state.openPlanId || '').trim() === targetPlanId,
            render: false
          });
        });
        closeClosePlanModal();
        renderPlaneacionesSurface({
          includeStats: true,
          includePlaneaciones: true,
          includeAlertas: false
        });
        setBanner('La planeación salió de abiertas. Sincronizando cierre...', 'info');
        for (const closePayload of closePayloads) {
          const targetPlanId = String((closePayload.currentPlan && closePayload.currentPlan.planeacion_id) || '').trim();
          if (!targetPlanId) continue;
          const actividadesPayload = (closePayload.actividades || []).map((item) => ({
            actividad_id: item.actividad_id,
            realizada: item.realizada,
            material_en_carpeta: item.material_en_carpeta,
            comentario_cierre: item.comentario_cierre
          }));
          const response = await api('confirmarCierre', {
            planeacion_id: targetPlanId,
            actividades: actividadesPayload,
            obs_semana: obs,
            request_id: uid('CIE')
          });
          const updatedPlan = response && response.planeacion ? response.planeacion : null;
          applyOptimisticPlanPatch(targetPlanId, updatedPlan ? Object.assign({}, updatedPlan, {
            estado: 'cerrada'
          }) : {
            estado: 'cerrada'
          }, {
            localState: '',
            localMessage: '',
            snapshotKind: 'planeacion_cierre_confirmada',
            closeOpenCard: false,
            render: false
          });
        }
        renderPlaneacionesSurface({
          includeStats: true,
          includePlaneaciones: true,
          includeAlertas: false
        });
        refreshPlaneacionesAlertsDeferred({
          force: true,
          includeStats: false,
          includePlaneaciones: false
        }).catch(() => {});
        setBanner('Cierre confirmado.', 'success');
      }, {
        button,
        key: buildActionKey('confirmarCierre', targetPlanIds.length ? targetPlanIds : [planId]),
        onError: (err) => {
          previousPlanSnapshots.forEach((snapshot) => {
            if (snapshot) upsertPlaneacionRow(snapshot);
          });
          state.openPlanId = previousOpenPlanId;
          state.openPlanDraft = previousDraftSnapshot;
          persistCurrentBootSnapshot('planeacion_cierre_revertido');
          renderPlaneacionesSurface({
            includeStats: true,
            includePlaneaciones: true,
            includeAlertas: false
          });
          openClosePlanModal(planId);
          const nextInput = $('closePlanObsInput');
          if (nextInput) nextInput.value = obs;
          setClosePlanModalError(formatApiError(err));
          refreshPlaneacionesSurface({ includeAlertas: false }).catch(() => {});
          return true;
        }
      });
    }

    function usePlanForActivities(button, planId) {
      editPlan(button, planId);
    }

    function usePlanForObservation(button, planId) {
      $('obsPlan').value = planId;
      renderObsAlumnoSelect();
      activateTab('seguimiento');
    }

    function bindHiddenPingShortcut() {
      const logo = $('brandLogo');
      const pingBtn = $('pingBtn');
      if (!logo || !pingBtn) return;
      let holdTimer = null;
      let fired = false;
      const clearHold = () => {
        if (holdTimer) {
          clearTimeout(holdTimer);
          holdTimer = null;
        }
      };
      const startHold = () => {
        clearHold();
        fired = false;
        holdTimer = setTimeout(() => {
          fired = true;
          handleAction('ping', pingBackend, { button: pingBtn });
        }, 1800);
      };
      const endHold = () => {
        clearHold();
      };
      logo.addEventListener('pointerdown', startHold);
      logo.addEventListener('pointerup', endHold);
      logo.addEventListener('pointerleave', endHold);
      logo.addEventListener('pointercancel', endHold);
      logo.addEventListener('contextmenu', (event) => {
        if (fired) event.preventDefault();
      });
    }

    function bindAdminUiEventsOnce() {
      if (!canUseAdminShell() || !state.ui || state.ui.adminUiEventsBound) return;
      if (!ensureAdminShellMarkupLoaded()) return;
      if ($('repAlumno')) $('repAlumno').addEventListener('change', (event) => {
        setReporteSelection('alumno_id', event.currentTarget.value);
        renderAdminReporteCicloModule();
      });
      if ($('repPeriodo')) $('repPeriodo').addEventListener('change', (event) => {
        setReporteSelection('periodo_id', event.currentTarget.value);
        renderAdminReporteCicloModule();
      });
      if ($('adminReportAlumno')) $('adminReportAlumno').addEventListener('change', (event) => {
        setReporteSelection('alumno_id', event.currentTarget.value);
        renderAdminReporteCicloModule();
      });
      if ($('adminReportPeriodo')) $('adminReportPeriodo').addEventListener('change', (event) => {
        setReporteSelection('periodo_id', event.currentTarget.value);
        renderAdminReporteCicloModule();
      });
      $('generateNowBtn').addEventListener('click', (event) => handleAction('requestReporteAlumno', generateReportNow, {
        button: event.currentTarget,
        key: buildActionKey('requestReporteAlumno', [getSelectedReporteAlumnoId(), getSelectedReportePeriodoId()])
      }));
      $('requestReportBtn').addEventListener('click', (event) => handleAction('regenerarReporteAlumno', requestReport, {
        button: event.currentTarget,
        key: buildActionKey('regenerarReporteAlumno', [getSelectedReporteAlumnoId(), getSelectedReportePeriodoId()])
      }));
      $('statusReportBtn').addEventListener('click', (event) => handleAction('getReporteAlumnoStatus', checkReportStatus, {
        button: event.currentTarget,
        key: buildActionKey('getReporteAlumnoStatus', [getSelectedReporteAlumnoId(), getSelectedReportePeriodoId()])
      }));
      if ($('adminGenerateNowBtn')) $('adminGenerateNowBtn').addEventListener('click', (event) => handleAction('requestReporteAlumno', generateReportNow, {
        button: event.currentTarget,
        key: buildActionKey('requestReporteAlumno', [getSelectedReporteAlumnoId(), getSelectedReportePeriodoId()])
      }));
      if ($('adminRequestReportBtn')) $('adminRequestReportBtn').addEventListener('click', (event) => handleAction('regenerarReporteAlumno', requestReport, {
        button: event.currentTarget,
        key: buildActionKey('regenerarReporteAlumno', [getSelectedReporteAlumnoId(), getSelectedReportePeriodoId()])
      }));
      if ($('adminStatusReportBtn')) $('adminStatusReportBtn').addEventListener('click', (event) => handleAction('getReporteAlumnoStatus', checkReportStatus, {
        button: event.currentTarget,
        key: buildActionKey('getReporteAlumnoStatus', [getSelectedReporteAlumnoId(), getSelectedReportePeriodoId()])
      }));
      if ($('adminNotificationNewBtn')) $('adminNotificationNewBtn').addEventListener('click', () => openNotificationEditor());
      if ($('adminNotificationFilterActiveBtn')) $('adminNotificationFilterActiveBtn').addEventListener('click', () => setNotificationFilter('activas'));
      if ($('adminNotificationFilterScheduledBtn')) $('adminNotificationFilterScheduledBtn').addEventListener('click', () => setNotificationFilter('programadas'));
      if ($('adminNotificationFilterDraftBtn')) $('adminNotificationFilterDraftBtn').addEventListener('click', () => setNotificationFilter('borradores'));
      if ($('adminNotificationFilterClosedBtn')) $('adminNotificationFilterClosedBtn').addEventListener('click', () => setNotificationFilter('cerradas'));
      if ($('adminNotificationTitle')) $('adminNotificationTitle').addEventListener('input', (event) => updateNotificationEditorField('titulo', event.currentTarget.value));
      if ($('adminNotificationMessage')) $('adminNotificationMessage').addEventListener('input', (event) => updateNotificationEditorField('mensaje', event.currentTarget.value));
      if ($('adminNotificationPriority')) $('adminNotificationPriority').addEventListener('change', (event) => updateNotificationEditorField('prioridad', event.currentTarget.value));
      if ($('adminNotificationStart')) $('adminNotificationStart').addEventListener('change', (event) => updateNotificationEditorField('fecha_inicio', event.currentTarget.value));
      if ($('adminNotificationEnd')) $('adminNotificationEnd').addEventListener('change', (event) => updateNotificationEditorField('fecha_cierre', event.currentTarget.value));
      if ($('adminNotificationAudience')) $('adminNotificationAudience').addEventListener('change', (event) => updateNotificationEditorField('visible_para', event.currentTarget.value));
      if ($('adminNotificationSaveDraftBtn')) $('adminNotificationSaveDraftBtn').addEventListener('click', (event) => saveNotificationEditor(event.currentTarget, 'borrador'));
      if ($('adminNotificationPublishBtn')) $('adminNotificationPublishBtn').addEventListener('click', (event) => saveNotificationEditor(event.currentTarget, 'publicada'));
      if ($('adminNotificationCancelBtn')) $('adminNotificationCancelBtn').addEventListener('click', () => {
        resetNotificationEditor();
        renderNotificationsAdmin();
      });
      bindAdminAlumnosEvents();
      document.querySelectorAll('[data-admin-module]').forEach((btn) => {
        btn.addEventListener('click', () => activateAdminModule(btn.dataset.adminModule));
      });
      document.querySelectorAll('[data-admin-module-launch]').forEach((btn) => {
        btn.addEventListener('click', () => activateAdminModule(btn.dataset.adminModuleLaunch));
      });
      state.ui.adminUiEventsBound = true;
    }

    function buildCreatePlanMutexKey() {
      const materiaId = String($('planMateria') ? $('planMateria').value : '').trim();
      return buildActionKey('crearPlaneacion', [
        $('planFecha').value,
        materiaId,
        getPlanEditorUsesTallerSelector(materiaId) ? getSelectedPlanTallerId() : getPlanEditorSelectedSubmateriaId(materiaId),
        getSelectedGroupIds().sort().join(','),
        getSelectedPlanAlumnos().sort().join(',')
      ]);
    }

    async function runCreatePlanAction(button, targetStatus) {
      const actionKey = buildCreatePlanMutexKey();
      if (inFlightActions.has(actionKey)) {
        return inFlightActions.get(actionKey);
      }
      const draftButton = $('savePlanDraftBtn');
      const activeButton = $('savePlanActiveBtn');
      setButtonBusy(draftButton, true, 'Procesando...');
      setButtonBusy(activeButton, true, 'Procesando...');
      try {
        return await handleAction('crearPlaneacion', () => savePlanEditor(targetStatus), {
          key: actionKey,
          busyText: 'Procesando...'
        });
      } finally {
        setButtonBusy(draftButton, false);
        setButtonBusy(activeButton, false);
      }
    }

    function bindEvents() {
      bindHiddenPingShortcut();
      document.addEventListener('click', (event) => {
        const dateInput = event.target && typeof event.target.closest === 'function'
          ? event.target.closest('input[type="date"]')
          : null;
        if (!dateInput) return;
        tryShowDatePicker(dateInput);
      });
      document.addEventListener('input', (event) => {
        const target = event && event.target;
        if (!target || !target.id || typeof target.id !== 'string') return;
        if (!target.id.startsWith('obs-general-')) return;
        const planId = target.id.replace('obs-general-', '');
        updateOpenPlanGeneralObservationDraft(planId, target.value);
      });
      $('pingBtn').addEventListener('click', (event) => handleAction('ping', pingBackend, { button: event.currentTarget }));
      $('loginBtn').addEventListener('click', (event) => triggerLoginAction(event.currentTarget));
      const tryPrimeLoginSnapshot = () => {
        if (state.session && state.session.token) return;
        const facilitadorId = $('facilitadorId').value.trim();
        if (!facilitadorId) return;
        primeLoginSnapshotCatalogos(facilitadorId);
      };
      $('facilitadorId').addEventListener('input', () => {
        scheduleUiDebounce('login-snapshot-preload', tryPrimeLoginSnapshot, 120);
      });
      $('facilitadorId').addEventListener('blur', tryPrimeLoginSnapshot);
      $('pinInput').addEventListener('focus', tryPrimeLoginSnapshot);
      $('pinInput').addEventListener('keydown', (event) => {
        if (event.key !== 'Enter') return;
        event.preventDefault();
        triggerLoginAction($('loginBtn'));
      });
      $('logoutBtn').addEventListener('click', (event) => handleAction('logout', logout, { button: event.currentTarget }));
      $('workspaceLogoutBtn').addEventListener('click', (event) => handleAction('logout', logout, { button: event.currentTarget }));
      $('reloadBtn').addEventListener('click', (event) => handleAction('refresh', refreshAll, { button: event.currentTarget }));
      $('savePlanBtn').addEventListener('click', (event) => handleAction('guardarPlaneacionCompleta', () => savePlanEditor(), {
        button: event.currentTarget,
        key: buildActionKey('guardarPlaneacionCompleta', [state.planEditor.planId || $('planFecha').value, $('planMateria').value, getPlanEditorSelectedSubmateriaId($('planMateria').value), getSelectedGroupIds().sort().join(','), getSelectedPlanAlumnos().sort().join(',')])
      }));
      if ($('savePlanDraftBtn')) $('savePlanDraftBtn').addEventListener('click', (event) => runCreatePlanAction(event.currentTarget, 'borrador'));
      if ($('savePlanActiveBtn')) $('savePlanActiveBtn').addEventListener('click', (event) => runCreatePlanAction(event.currentTarget, 'activa'));
      $('togglePlanBuilderBtn').addEventListener('click', () => togglePlanBuilder());
      $('addActivityBtn').addEventListener('click', () => addEditorActivity());
      if ($('closePlanCancelBtn')) $('closePlanCancelBtn').addEventListener('click', () => closeClosePlanModal());
      if ($('closePlanConfirmBtn')) $('closePlanConfirmBtn').addEventListener('click', (event) => submitClosePlan(event.currentTarget));
      if ($('selectAllGroupsBtn')) $('selectAllGroupsBtn').addEventListener('click', () => toggleAllGroups(true));
      if ($('clearAllGroupsBtn')) $('clearAllGroupsBtn').addEventListener('click', () => toggleAllGroups(false));
      if ($('selectAllVisibleAlumnosBtn')) $('selectAllVisibleAlumnosBtn').addEventListener('click', () => toggleAllVisibleAlumnos(true));
      if ($('clearVisibleAlumnosBtn')) $('clearVisibleAlumnosBtn').addEventListener('click', () => toggleAllVisibleAlumnos(false));
      $('saveObsBtn').addEventListener('click', (event) => handleAction('crearObsAlumno', saveObservation, {
        button: event.currentTarget,
        key: buildActionKey('crearObsAlumno', [$('obsPlan').value, $('obsAlumno').value, $('obsPeriodo').value, $('obsTipo').value, $('obsNota').value.trim().slice(0, 40)])
      }));
      $('saveEvaBtn').addEventListener('click', (event) => handleAction('guardarEvaluacion', saveEvaluation, {
        button: event.currentTarget,
        key: buildActionKey('guardarEvaluacion', [$('evaAlumno').value, $('evaMateria').value, $('evaPeriodo').value, $('evaNivel').value, $('evaComentario').value.trim().slice(0, 40)])
      }));
      $('saveNotaBtn').addEventListener('click', (event) => handleAction('crearNotaDirectora', saveNote, {
        button: event.currentTarget,
        key: buildActionKey('crearNotaDirectora', [$('notaAlumno').value, $('notaAlcance').value, $('notaPeriodo').value, $('notaTipo').value, $('notaTexto').value.trim().slice(0, 40)])
      }));
      $('planFecha').addEventListener('input', handlePlanFechaChanged);
      $('planFecha').addEventListener('change', handlePlanFechaChanged);
      $('planMateria').addEventListener('change', () => {
        clearPlanEditorValidation('planMateria');
        clearPlanEditorValidation('planSubmateria');
        state.planEditor.selectedSubmateriaId = '';
        state.planEditor.selectedTallerId = '';
        syncPlanSubmateriaSelect('');
        renderPlanAlumnosChecklist(new Set(getSelectedPlanAlumnos()));
      });
      if ($('planSubmateria')) $('planSubmateria').addEventListener('change', (event) => {
        clearPlanEditorValidation('planSubmateria');
        if (getPlanEditorUsesTallerSelector($('planMateria') ? $('planMateria').value : '')) {
          handlePlanTallerChanged(event);
          return;
        }
        state.planEditor.selectedTallerId = '';
        state.planEditor.selectedSubmateriaId = event.currentTarget.value || '';
      });
      $('planGruposChecklist').addEventListener('change', handlePlanGroupChecklistChange);
      $('planAlumnosChecklist').addEventListener('change', () => clearPlanEditorValidation('planAlumnosChecklist'));
      $('obsPlan').addEventListener('change', renderObsAlumnoSelect);
      $('evaMateria').addEventListener('change', renderEvaluationDependencies);
      $('filterAlumnoSearch').addEventListener('change', syncAlumnoFilterFromInput);
      $('filterAlumnoSearch').addEventListener('blur', syncAlumnoFilterFromInput);
      $('clearAlumnoFilterBtn').addEventListener('click', clearAlumnoFilter);
      $('filterPlaneacionesBtn').addEventListener('click', (event) => handleAction('filtrar planeaciones', async () => {
        syncAlumnoFilterFromInput();
        clearPlaneacionesMateriaFilter();
        await refreshPlaneacionesSurface({ includeAlertas: false });
      }, { button: event.currentTarget }));
      window.addEventListener('online', () => {
        schedulePlaneacionOutboxProcessing(120);
      });
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) schedulePlaneacionOutboxProcessing(120);
      });
      $('notaAlcance').addEventListener('change', syncNotePeriodoState);
      document.querySelectorAll('.tab-btn').forEach((btn) => {
        btn.addEventListener('click', () => activateTab(btn.dataset.tab));
      });
      if (canUseAdminShell()) bindAdminUiEventsOnce();
    }

    const windowActionGroups = {
      core: {
        planAction,
        saveActivityProgress,
        togglePlanOpen,
        prioritizePlaneacionDetailPrefetch,
        editPlan,
        approvePlan,
        rejectPlan,
        resubmitPlan,
        confirmClosePlan,
        saveOpenPlan,
        saveMultiGroupShared,
        markPlanMaterialReady,
        saveGeneralObservation,
        saveAlumnoFinalObservation,
        saveAllAlumnoFinalObservations,
        autoGrowObsFinal,
        openPlanFromAlert,
        togglePlanAlumnosByGroup,
        updateOpenPlanDraftField,
        toggleOpenPlanDraftAlumno,
        updateOpenPlanDraftActivityField,
        addOpenPlanDraftActivity,
        removeOpenPlanDraftActivity,
        moveOpenPlanDraftActivity,
        toggleAllOpenPlanDraftAlumnos,
        exitPlanFocus,
        savePlanChanges,
        updateMultiGroupSharedField,
        updateMultiGroupSharedActivityField,
        addMultiGroupSharedActivity,
        removeMultiGroupSharedActivity,
        switchMultiGroupPlan,
        updateEditorActivityField,
        moveEditorActivity,
        removeEditorActivity,
        usePlanForActivities,
        usePlanForObservation
      },
      admin: {
        activateAdminModule,
        editNotification,
        notificationAction,
        toggleNotificationAudienceFacilitador,
        openFacilitadorPanel,
        openFacilitadorEditor,
        openFacilitadorPin,
        closeFacilitadorPinPanel,
        saveFacilitadorPin,
        toggleFacilitadorActivo,
        archiveFacilitador,
        reactivateFacilitador,
        openFacilitadorAsignacionEditor,
        closeFacilitadorAsignacionPanel,
        saveFacilitadorAsignacion,
        archiveFacilitadorAsignacion,
        openFacilitadorPlaneaciones,
        renderAdminTalleresModule,
        selectTaller,
        openTallerEditor,
        saveTallerEditor,
        toggleTallerStatus,
        archiveTaller,
        reactivateTaller,
        openTallerMembershipEditor,
        cancelTallerMembershipEditor,
        toggleTallerAlumnoDraft,
        toggleAllVisibleTallerAlumnos,
        saveTallerMemberships,
        renderAdminMateriasModule,
        selectMateria,
        openMateriaEditor,
        closeMateriaEditor,
        saveMateriaEditor,
        openSubmateriaEditor,
        closeSubmateriaEditor,
        saveSubmateriaEditor,
        archiveMateria,
        reactivateMateria,
        toggleMateriaStatus,
        moveMateria,
        archiveSubmateria,
        reactivateSubmateria,
        toggleSubmateriaStatus,
        moveSubmateria,
        openAlumnoEditor,
        closeAlumnoEditor,
        saveAlumnoEditor,
        openCambioGrupo,
        closeCambioGrupo,
        confirmCambioGrupo,
        pauseAlumno,
        archiveAlumno,
        reactivateAlumno,
        openAlumnoHistorial,
        closeAlumnoHistorial,
        copyAlumnoId,
        toggleAlumnoDeleteControl,
        previewAlumnoDeleteControl,
        executeAlumnoDeleteControl
      }
    };

    const boundWindowActionGroups = new Set();

    function bindWindowActionGroup(groupName) {
      const key = String(groupName || '').trim();
      if (!key || boundWindowActionGroups.has(key) || !windowActionGroups[key]) return;
      Object.assign(window, windowActionGroups[key]);
      boundWindowActionGroups.add(key);
    }

    async function boot() {
      loadConfig();
      loadSession();
      bindWindowActionGroup('core');
      if (state.session && state.session.token && canUseAdminShell()) {
        ensureAdminShellMarkupLoaded();
        bindWindowActionGroup('admin');
        bindAdminUiEventsOnce();
      }
      bindEvents();
      // Warmup V1: ping silencioso al backend durante el boot, antes de que
      // el facilitador haga su primer click. Fire-and-forget, no bloquea ni
      // afecta render.
      scheduleBackendWarmup();
      clearLoginInputs();
      refreshStaticConfigUi();
      if (state.session && state.session.token) {
        const restoredSnapshot = restoreBootSnapshot();
        activatePlaneacionOutboxForSession(state.session);
        if (!canUseAdminShell() && String(state.activeTab || '').trim() === 'planeaciones') {
          setPlaneacionesRestoreLock(true);
        }
        renderBootSurface();
        if (shouldDeferFacilitadorRestoreRefresh(restoredSnapshot)) {
          scheduleDeferredRestoreRefresh();
          return;
        }
        setRestoreSnapshotSyncing(false);
        await handleAction('restore', () => refreshAll({ fastFacilitadorBoot: true }));
        return;
      }
      renderAll();
    }

    boot();
