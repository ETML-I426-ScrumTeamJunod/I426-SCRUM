import vine from '@vinejs/vine'

const email = () => vine.string().email().maxLength(254)
const password = () => vine.string().minLength(8).maxLength(32)

export const signupValidator = vine.compile(
  vine.object({
    nom: vine.string(),
    email: email().unique({ table: 't_user', column: 'email' }),
    motDePasse: password().confirmed({
      confirmationField: 'passwordConfirmation',
    }),
  })
)
