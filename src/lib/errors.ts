/** Error whose text is an i18n key and its parameters; the UI translates it with errorText(). */
export class AppError extends Error {
  key: string;
  params: Record<string, string | number>;
  constructor(key: string, params: Record<string, string | number> = {}) {
    super(key);
    this.key = key;
    this.params = params;
  }
}
