/** @type {import('next').NextConfig} */
const nextConfig = {
  // ← Isso aqui mata a bolinha e o DevTools overlay inteiro
  devIndicators: false,

  // Ou, se preferir a forma mais nova/experimental (também funciona no 16):
  // experimental: {
  //   devTools: false,
  // },
};

export default nextConfig;