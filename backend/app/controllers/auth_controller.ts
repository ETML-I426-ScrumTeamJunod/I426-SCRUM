import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { registerValidator, loginValidator } from '#validators/auth'

export default class AuthController {
  /**
   * Inscription d'un nouvel utilisateur
   */
  async register({ request, response }: HttpContext) {
    const payload = await request.validateUsing(registerValidator)

    const user = await User.create({
      nom: payload.nom,
      email: payload.email,
      motDePasse: payload.motDePasse,
    })

    const token = await User.accessTokens.create(user)

    return response.created({
      user: user.serialize(),
      token: token.toJSON(),
    })
  }

  /**
   * Connexion d'un utilisateur existant
   */
  async login({ request, response }: HttpContext) {
    const { email, motDePasse } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, motDePasse)

    const token = await User.accessTokens.create(user)

    return response.ok({
      user: user.serialize(),
      token: token.toJSON(),
    })
  }

  /**
   * Déconnexion
   */
  async logout({ auth, response }: HttpContext) {
    const user = auth.user!
    await User.accessTokens.delete(user, user.currentAccessToken.identifier)

    return response.ok({
      message: 'Déconnexion réussie',
    })
  }

  /**
   * Récupérer l'utilisateur actuellement connecté
   */
  async me({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    return response.ok({
      user: user.serialize(),
    })
  }
}
