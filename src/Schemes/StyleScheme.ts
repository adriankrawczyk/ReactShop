const ColorScheme = {
  primary: "#f4f7fc",
  second: "#fff",
};

const StyleScheme = {
  borderRadius: "3%",
  boxShadow: "0px 0px 10px -5px rgba(66, 68, 90, 1)",
  borderColor: "#bbb",
};

const WithTransition = () => {
  return `transition: transform 0.25s ease-in-out;
  &:hover {
    transform: scale(1.125);
  }`;
};
export { ColorScheme, StyleScheme, WithTransition };
