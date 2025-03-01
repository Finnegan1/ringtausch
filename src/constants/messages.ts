/** Messages to be shared across the application */
export const Messages = {
  // General errors
  ERROR_TRY_AGAIN_LATER: "Etwas ist schiefgelaufen. Bitte versuche es später erneut.",
  ERROR_INTERNAL_SERVER: "Interner Serverfehler.",

  // Authentication errors
  ERROR_AUTHENTICATION: "Ein Fehler bei der Authentifizierung ist aufgetreten.",
  ERROR_USER_NOT_LOGGED_IN: "Du bist nicht eingeloggt.",

  // Item related errors
  ERROR_ITEM_CREATE: "Fehler beim Erstellen des Angebots.",
  ERROR_ITEM_UPDATE: "Fehler beim Aktualisieren des Angebots.",
  ERROR_ITEM_DELETE: "Fehler beim Löschen des Angebots.",
  ERROR_ITEM_GET: "Fehler beim Abrufen des Angebots.",
  ERROR_ITEM_NOT_FOUND: "Angebot nicht gefunden.",

  // Item related success
  SUCCESS_ITEM_CREATE: "Angebot erfolgreich erstellt.",
  SUCCESS_ITEM_UPDATE: "Angebot erfolgreich aktualisiert.",
  SUCCESS_ITEM_DELETE: "Angebot erfolgreich gelöscht.",

  // File related errors
  ERROR_FILE_UPLOAD: "Fehler beim Hochladen der Datei.",
  ERROR_FILE_TOO_LARGE: "Die Datei ist zu groß.",
  ERROR_PRESIGNED_URL: "Fehler beim Abrufen der Upload-URL.",
  ERROR_FILE_INVALID: "Ungültige Datei.",
  ERROR_FILE_NOT_IMAGE: "Nur Bilddateien sind erlaubt.",
  ERROR_FILE_REQUIRED: "Mindestens eine Datei ist erforderlich.",

  // Loan related errors
  ERROR_LOAN_NOT_FOUND: "Ausleihe nicht gefunden.",
  ERROR_LOAN_UPDATE: "Fehler beim Aktualisieren der Ausleihe.",
  ERROR_LOAN_STATUS: "Die Ausleihe hat nicht den erforderlichen Status.",
  ERROR_LOAN_ALREADY_RATED: "Diese Ausleihe wurde bereits bewertet.",
  ERROR_LOAN_NOT_FINISHED: "Die Ausleihe ist noch nicht abgeschlossen.",

  // Rating related errors
  ERROR_RATING_INVALID: "Die Bewertung muss zwischen 1 und 5 liegen.",

  // Data fetching errors
  ERROR_FETCH_DATA: "Fehler beim Abrufen der Daten.",
};
