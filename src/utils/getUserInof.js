export const getSavedUserInfo = () => {
  const email = localStorage.getItem("rememberedEmail");

  if (!email) {
    return null;
  }

  return { email, role : 'user' };
//   return { email, role : 'admin' };
};