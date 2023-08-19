import { Button } from "@chakra-ui/react";

const CustomButton = ({ click, label }) => {
  return (
    <Button
      bgColor="rgb(255, 255, 255, .3)"
      border="1px"
      borderColor="black"
      borderRadius="20px"
      fontWeight="10px"
      padding="20px"
      transition="transform 0.4s, background-color 0.4s, color 0.4s, box-shadow 0.4s ease"
      onClick={click}
      _hover={{
        transform: "scale(1.05) ",
        bgColor: 'black',
        opacity: "1",
        color: "white",
        border: "none",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
      }}
    >
      {label}
    </Button>
  );
};

export default CustomButton;
