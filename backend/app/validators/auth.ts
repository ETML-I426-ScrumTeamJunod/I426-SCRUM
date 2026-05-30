import vine from '@vinejs/vine'

/**
 * Validator pour l'inscription
 */
export const registerValidator = vine.compile(
  vine.object({
    nom: vine.string().trim().minLength(2).maxLength(255),

    email: vine
      .string()
      .trim()
      .email()
      .normalizeEmail()
      .unique(async (db, value) => {
        const user = await db.from('t_user').where('email', value).first()
        return !user
      }),

    motDePasse: vine.string().minLength(8).maxLength(180),
  })
)

/**
 * Validator pour la connexion
 */
export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email().normalizeEmail(),

    motDePasse: vine.string(),
  })
)
