const ColorScheme = {
  green: "rgb(187, 255, 187)",
  orange: "rgb(255, 243, 187)",
  red: "rgb(255, 194, 181)",
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
