export const getSavedUserInfo = () => {
  const email = localStorage.getItem("rememberedEmail");

  if (!email) {
    return null;
  }

  return { email, role : 'user', name:"MD Rahim Sikdar", image:'https://i.ibb.co.com/whLf6dZp/me.png', id: "user_101" };
  // return { email, role : 'admin', name:"MD Rahim Sikdar", image:'https://i.ibb.co.com/whLf6dZp/me.png', id: "user_101" };

};