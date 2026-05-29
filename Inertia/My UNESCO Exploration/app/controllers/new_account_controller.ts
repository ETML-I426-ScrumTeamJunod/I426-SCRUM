import User from '#models/user'
import { signupValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class NewAccountController {
  async create({ inertia }: HttpContext) {
    return inertia.render('auth/signup', {})
  }

  async store({ request, response, auth }: HttpContext) {
    try {
      const { nom, email, motDePasse } = await request.validateUsing(signupValidator)

      //debug
      console.log("Création d'un user : ", { nom, email, motDePasse })

      if (!email || !motDePasse) {
        return response.status(400).json({ error: 'Email et mot de passe requis' })
      }
      const user = await User.create({
        nom: nom,
        email: email,
        motDePasse: motDePasse,
      })

      await auth.use('web').login(user)
      response.redirect().toRoute('home')
    } catch (error) {
      console.log('Erreur de validation', error)
    }
  }
}
