import User from '#models/user'
import { signupValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class NewAccountController {
  async create({ inertia }: HttpContext) {
    return inertia.render('auth/signup', {})
  }

  async store({ request, response, auth }: HttpContext) {
    const { nom, email, motDePasse } = await request.validateUsing(signupValidator)

    if (!email || !motDePasse) {
      return response.status(400).json({ error: "Email et mot de passe requis" });
    }
    const user = await User.create({
    nom: nom,
    email: email,
    motDePasse: motDePasse,
    })

    await auth.use('web').login(user)
    response.redirect().toRoute('home')
  }
}
