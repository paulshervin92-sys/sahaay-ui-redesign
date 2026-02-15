declare module "../../utils/email.js" {
  export function sendEmail(to: string, subject: string, body: string): Promise<void>;
}