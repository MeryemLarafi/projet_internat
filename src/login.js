export default function LoginCard() {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex max-w-4xl w-full bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Section de gauche */}
          <div className="w-1/2 bg-gray-800 text-white flex flex-col justify-center items-center p-8">
            <h2 className="text-2xl font-bold">Welcome to</h2>
            <h2 className="text-3xl font-bold">GestioPro</h2>
            <p className="mt-4 text-center">
              Bienvenue sur notre plateforme ! Découvrez nos services et explorez
              tout ce que nous avons à offrir.
            </p>
            <button className="mt-6 px-6 py-2 border border-white rounded-lg hover:bg-white hover:text-gray-800 transition">
              Know More
            </button>
          </div>
  
          {/* Section de droite */}
          <div className="w-1/2 p-8">
            <h2 className="text-2xl font-bold text-center">Login</h2>
            <form className="mt-6">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                placeholder="Entrez votre email"
                className="w-full mt-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
              />
  
              <label className="block mt-4 text-gray-700">Mot de passe</label>
              <input
                type="password"
                placeholder="Entrez votre mot de passe"
                className="w-full mt-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
              />
  
              <label className="block mt-4 text-gray-700">
                Se connecter en tant que
              </label>
              <select className="w-full mt-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800">
                <option>Admin</option>
                <option>Utilisateur</option>
              </select>
  
              <button className="w-full mt-6 bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition">
                Ce Connecter
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
  