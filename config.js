/* config.js — À CHANGER AVANT PUBLICATION
   Seules les empreintes SHA-256 sont stockées ici (jamais les valeurs en clair).
   - motDePasseAdmin : SHA-256 du mot de passe de admin.html
   - fragmentGenerateur : SHA-256 de la valeur après "#k=" de la puce 1 (generateur.html)
   - fragmentImage : SHA-256 de la valeur après "#k=" de la puce 2 (image.html)
   Calcul d'une empreinte : printf '%s' 'valeur' | sha256sum
   (ou l'outil intégré à admin.html, après connexion). Ce n'est pas une protection réelle. */
window.CIRCUIT_CONFIG = {
  motDePasseAdmin: "f43473f61809312b4eaba59594f41436581879757b2d256a0254f77ab56de9b3",
  fragmentGenerateur: "6540e017abb06180c432d796e3215bf83ecae2596d5597a6f9c32aa6784a980b",
  fragmentImage: "6315b4fbfa3bbf75c9424925f940e7cb42a023125e8cb81b9fddceb13bd06214"
};
