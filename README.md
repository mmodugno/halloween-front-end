# Noche de disfraces: manual del admin

Una app web para votar el mejor disfraz de la fiesta. Cada invitado entra desde su celu con su contraseña, vota los disfraces que más le gustaron y les deja un mensajito. Al final, la pantalla grande revela el podio.

- **App para los invitados:** https://noche-de-disfraces.onrender.com
- **Pantalla grande (tele o proyector):** https://noche-de-disfraces.onrender.com/pantalla
- **Guía para explicarles la app a los invitados:** [GUIA-INVITADOS.md](GUIA-INVITADOS.md)

---

## Cómo funciona, en una mirada

1. **Antes de la fiesta:** la gente se anota sola desde el link con su disfraz (o vos los cargás) y recibe una contraseña.
2. **En la fiesta, en espera:** todos entran con su contraseña y ven "La votación todavía no abrió".
3. **Votación abierta:** cada uno vota disfraces (2 votos por persona, configurable) y deja un mensaje. Los mensajes aparecen en vivo, de forma anónima.
4. **Ganadores:** cerrás la votación, la pantalla grande revela el podio y cada uno ve los votos que recibió su disfraz.

Las reglas de votación:

- Se vota al **disfraz**, no a la persona. Si varias personas comparten disfraz, compiten juntas.
- Nadie puede votar su **propio disfraz**.
- Nadie puede votar a un disfraz de su **grupo de amigos** (los grupos los armás vos, ver más abajo).
- No se puede votar dos veces al mismo disfraz.
- El mensaje es obligatorio (hasta 280 caracteres).
- Un voto se puede deshacer durante 30 segundos.

---

## Entrar como admin

1. Abrí la app y entrá con tu contraseña de admin.
2. Tocá **Panel de admin** (aparece en la pantalla de espera, en la de votación y en la de ganadores).
3. Para volver a la app normal, tocá **← Volver a la fiesta**.

El panel tiene cuatro pestañas: **Juego**, **Invitados**, **Mensajes** y **Resultados**.

---

## Pestaña Juego

### Qué ven todos ahora

La fiesta tiene tres momentos. El actual aparece resaltado y los botones te llevan a los otros:

| Momento | Qué ven los invitados | Se puede votar |
|---|---|---|
| **En espera** | "La votación todavía no abrió" | No |
| **Votación abierta** | La lista de disfraces para votar | Sí |
| **Ganadores** | El podio y los votos que recibió su disfraz | No |

- Siempre te pide confirmación antes de cambiar.
- Podés ir y volver: por ejemplo, reabrir la votación después de mostrar los ganadores. Los votos se mantienen.
- Todos los celulares cambian solos en unos segundos, nadie tiene que recargar.

### Inscripción

- **Abierta:** cualquiera con el link se puede anotar con su disfraz.
- **Cerrada:** solo vos podés agregar invitados.
- Se **cierra sola** cuando abrís la votación y se reabre si volvés a "En espera" (si la dejaste abierta).
- **Copiar link para invitar:** copia el link de la app para mandarlo al grupo.
- **Votos para cada persona que se anota:** cuántos votos recibe cada nuevo invitado (2 por defecto). Si lo cambiás, tocá **Guardar**.

### Pantalla grande

Botón para abrir la pantalla grande en otra pestaña. Ver la sección [La pantalla grande](#la-pantalla-grande).

### Votos

Una barra con cuántos votos se usaron del total posible. Sirve para saber cuándo ya votó casi todo el mundo.

### Empezar de cero

Borra **todos los votos y mensajes** y le da a cada invitado la cantidad de votos que elijas. Los invitados y los disfraces no se borran. No se puede deshacer: usalo solo para limpiar las pruebas antes de la fiesta.

---

## Pestaña Invitados

La lista de todos los invitados, agrupados por disfraz.

### Ver y pasar contraseñas

- La contraseña de cada invitado aparece en naranja al lado de su nombre. **Tocala para copiarla.**
- **Copiar contraseñas** copia la lista completa, agrupada por disfraz, para pegarla en WhatsApp o donde quieras.
- Si alguien se olvidó la contraseña, buscala acá.

### Agregar invitados

- **Agregar invitado:** nombre, disfraz (opcional), votos y si es admin. La contraseña se crea sola (el nombre más dos números, por ejemplo `lu38`) y te aparece al guardar.
- **Pegar una lista:** un invitado por renglón, nombre y disfraz separados por coma:
  ```
  Lu, Bruja del bosque
  Tomi, Zombie
  Sai
  ```
  Si dos personas tienen el mismo disfraz, quedan en el mismo grupo.

### Editar a alguien

Tocá **Editar** en la persona:

- Cambiar nombre, votos que le quedan o si es admin (para hacer admin a alguien, tildá **Es admin**).
- **Cambiarlo de disfraz:** escribí el nombre de otro disfraz que ya existe y pasa a ese grupo. Si escribís un nombre nuevo, se crea ese disfraz.
- **Sacar de la fiesta:** borra a la persona y los votos que hizo. Si era la única con ese disfraz, el disfraz también se va y quienes lo habían votado recuperan ese voto.

### Renombrar un disfraz

Tocá **Renombrar** al lado del nombre del disfraz. Cambia para todo el grupo y mantiene los votos.

### Grupos de amigos

Para que la gente vote fuera de su círculo, podés juntar disfraces en un **grupo de amigos**: los disfraces de un mismo grupo no se pueden votar entre sí.

1. Tocá **Grupo** al lado del nombre del disfraz.
2. Escribí el nombre del grupo, por ejemplo `Amigos de la facu`, y tocá **Guardar**.
3. Repetí con los otros disfraces del grupo, escribiendo **el mismo nombre**. Te lo sugiere al empezar a escribir y no importan las mayúsculas.

- Arriba de la lista, la sección **Grupos de amigos** muestra cada grupo con sus disfraces. Cada disfraz también muestra su grupo en una etiqueta verde.
- Para sacar un disfraz de su grupo: **Grupo** → **Sacar del grupo**.
- **Solo vos ves los nombres de los grupos.** Los invitados solo ven "Tu grupo" en lugar del botón Votar en los disfraces de su grupo.
- El grupo es por disfraz: si una pareja comparte disfraz, con ponérselo una vez alcanza.
- Armalos **antes de abrir la votación**. Si los cambiás con la votación abierta, los votos que ya se hicieron no cambian.

---

## Pestaña Mensajes

Todos los mensajes que dejaron con los votos, con quién lo escribió y para qué disfraz. Sirve para moderar.

- Los mensajes aparecen en el tablero en vivo **entre 2 y 8 minutos después** del voto, así nadie sabe quién escribió qué mirando quién acaba de votar. Vos los ves al instante.
- Cada mensaje tiene una etiqueta: **Por publicarse**, **En el tablero** u **Oculto**.
- **Ocultar** saca un mensaje del tablero en vivo y de la pantalla grande. El voto sigue contando. **Mostrar** lo vuelve a poner.

---

## Pestaña Resultados

Todos los disfraces que recibieron votos, ordenados de más a menos, con quién los votó y qué les escribió. Se puede mirar en cualquier momento, también con la votación abierta.

---

## La pantalla grande

Abrila en la tele o el proyector y dejala prendida toda la noche: **https://noche-de-disfraces.onrender.com/pantalla**. No necesita contraseña y cambia sola según el momento de la fiesta.

- **En espera:**
  - El título "Noche de disfraces", una calabaza y un **código QR** para entrar desde el celu.
  - Un cartel: "La votación abre en un ratito. ¿Todavía no te anotaste? Escaneá y anotate con tu disfraz." Si la inscripción está cerrada, dice "Mientras tanto, entrá con tu contraseña".
- **Votación abierta:**
  - "Mejor disfraz: la votación está abierta".
  - Los **mensajes en vivo** que van llegando (anónimos, para cada disfraz).
  - Una barra de cuántos votos se usaron.
  - El QR con el link, para quien todavía no entró.
- **Ganadores:** la revelación del podio.
  1. "La votación terminó. Y los mejores disfraces de la noche son..."
  2. Tercer puesto, segundo puesto y primer puesto, de a uno, con su cantidad de votos.
  3. El podio completo con confeti.

  Avanza sola (unos 6 segundos por puesto). Para manejarla vos:
  - **Click, barra espaciadora o flecha →:** pasa al siguiente.
  - **R:** empieza la revelación de nuevo.

**Tip:** poné la pantalla en completo con **F11**.

---

## Checklist para la fiesta

**Antes:**

- [ ] Mandar el link al grupo para que se anoten (Juego → **Copiar link para invitar**).
- [ ] Revisar la lista de invitados y arreglar nombres o disfraces duplicados.
- [ ] Sacar los usuarios de prueba (Prueba Uno a Cuatro, y Holi si era de prueba).
- [ ] Armar los grupos de amigos.
- [ ] Juego → **Empezar de cero** para borrar los votos de prueba.
- [ ] Dejar el juego **En espera**.

**En la fiesta:**

- [ ] Abrir la pantalla grande en la tele, en pantalla completa.
- [ ] Explicar la app (ver [GUIA-INVITADOS.md](GUIA-INVITADOS.md)).
- [ ] Juego → **Abrir votación** (cierra la inscripción sola).
- [ ] Mirar Mensajes de vez en cuando por si hay que ocultar alguno.
- [ ] Cuando la barra de votos esté casi llena: **Cerrar y mostrar ganadores**.

---

## Si algo no anda

- **La app tarda mucho en cargar la primera vez:** el servidor gratis se duerme si nadie lo usa y tarda hasta un minuto en despertarse. Del 30/10 al 1/11 a la mañana se mantiene despierto solo.
- **No anda nada:** puede ser que Aiven haya apagado la base de datos. Entrá a https://console.aiven.io, proyecto **halloween**, servicio **halloween-db**, y tocá **Power on**. Tarda unos minutos y los datos se mantienen.
- **No veo un cambio nuevo de la app:** recargá la página (en la compu, Ctrl + Shift + R; en el celu, cerrá la pestaña y abrila de nuevo).
- **Alguien ve "No podés pasar":** está en una ventana de incógnito. Tiene que abrir el link en una ventana normal.
- **Alguien se olvidó la contraseña:** Invitados → tocá su contraseña para copiarla y pasásela.

---

## Para desarrolladores

- Frontend: React (Create React App). Backend: Go, en el repo `halloween-back-end`. Base de datos: MySQL.
- Hosting gratis: Render (sitio estático y web service) y Aiven (MySQL).
- Correr local: `npm install` y `npm start`, con `REACT_APP_BACKEND_URL=http://localhost:8080/api` en un archivo `.env`.
- Tests: `npm test`. Build: `npm run build`.
