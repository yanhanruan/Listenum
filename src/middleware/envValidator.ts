// TODO implement authorization validation
export function validateTtsEnv() {
    const requiredVars = ["AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY"];
    requiredVars.forEach((varName) => {
      if (!process.env[varName]) throw new Error(`${varName}NOT ALLOWED`);
    });
  }