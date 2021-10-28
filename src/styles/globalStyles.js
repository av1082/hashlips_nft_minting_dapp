import styled from "styled-components";
import {Rocket} from '@styled-icons/ionicons-sharp/Rocket';
import {Link45deg} from '@styled-icons/bootstrap/Link45deg';
import {LinkedinSquare} from '@styled-icons/boxicons-logos/LinkedinSquare';
import {Instagram} from '@styled-icons/boxicons-logos/Instagram';
import {Github} from '@styled-icons/boxicons-logos/Github';
import {DiscordAlt} from '@styled-icons/boxicons-logos/DiscordAlt';
import {Twitter} from '@styled-icons/boxicons-logos/Twitter'


// Used for wrapping a page component


export const Header = styled.header`
  position: absolute;
  top: 0;
  width: 100%;
  display: flex;
  flex: ${({ flex }) => (flex ? flex : 0)};
  flex-direction: ${({ fd }) => (fd ? fd : "row")};
  justify-content: ${({ jc }) => (jc ? jc : "space-between")};
  align-items: ${({ ai }) => (ai ? ai : "center")};
  line-height: 120px;
  height: 100px;
  background: transparent;
  font-family: 'Chakra Petch', sans-serif;

`;

export const HeaderButton = styled.button`
  padding: 10px;
  border-radius: 15px;
  background: transparent;
  color: white;
  font-weight: 300;
  font-family: 'Chakra Petch', sans-serif;
  font-size: 15px;
  border: 2px solid transparent;
`;

export const MintButton = styled.button`
  padding: 10px;
  height: 40px;
  width: 140px;
  border-radius: 20px;
  background: #360368;
  color: white;
  font-weight: bold;
  font-family: 'Chakra Petch', sans-serif;
  border: 2px solid #360368;

  &:hover {
    background-color: orange;
    border: 2px solid orange;
  }
  &:focus {
    opacity: 0.2;
  }
`;


export const ConnectButton = styled.button`
  max-width: 100%;
  padding: 10px;
  border-radius: 20px;
  background: transparent;
  color: white;
  font-weight: bold;
  font-family: 'Chakra Petch', sans-serif;
  border: 2px solid #00e600;

  &:hover {
    background-color: gray;
    border: 2px solid #00e600;
  }

  &:focus {
    opacity: 0.2;
  }
`;

// Used for providing space between components
export const SpacerXSmall = styled.div`
  height: 8px;
  width: 8px;
`;

// Used for providing space between components
export const SpacerSmall = styled.div`
  height: 16px;
  width: 16px;
`;

// Used for providing space between components
export const SpacerMedium = styled.div`
  height: 75px;
  width: 75x;
`;

// Used for providing space between components
export const SpacerLarge = styled.div`
  height: 175px;
  width: 175px;
`;

// Used for providing a wrapper around a component
export const Container = styled.div`
  display: flex;
  flex: ${({ flex }) => (flex ? flex : 1)};
  flex-direction: ${({ fd }) => (fd ? fd : "column")};
  justify-content: ${({ jc }) => (jc ? jc : "flex-start")};
  align-items: ${({ ai }) => (ai ? ai : "flex-start")};
  background-color: ${({ test }) => (test ? "pink" : "none")};
  width: 100%;
  background-image: ${({ image }) => (image ? `url(${image})` : "none")};
  background-size: cover;
  background-position: center;
`;

export const ContainerTwo = styled.div`
  display: flex;
  flex: ${({ flex }) => (flex ? flex : 0)};
  flex-direction: ${({ fd }) => (fd ? fd : "column")};
  justify-content: ${({ jc }) => (jc ? jc : "flex-start")};
  align-items: ${({ ai }) => (ai ? ai : "flex-start")};
  background-color: ${({ test }) => (test ? "pink" : "none")};
  width: 100%;
  background-size: cover;
  background-position: center;
`;



export const Billies = styled.p`
margin-top: 20px;
display: flex;
flex-direction: ${({ fd }) => (fd ? fd : "row")};
justify-content: ${({ jc }) => (jc ? jc : "space-between")};
align-items: ${({ ai }) => (ai ? ai : "flex-start")};
width: 100%;
`;

export const TextTitle = styled.p`
  color: var(--white);
  font-size: 80px;
  font-weight: bold;
  font-family: 'Chakra Petch', sans-serif;
`;

export const TextSubTitle = styled.p`
  color: var(--white);
  font-size: 40px;
  font-weight: bold;
  font-family: 'Chakra Petch', sans-serif;
`;

export const TextDescription = styled.p`
  color: var(--white);
  font-size: 30px;
  font-weight: 300;
  font-family: 'Chakra Petch', sans-serif;
`;

export const StyledClickable = styled.div`
  :active {
    opacity: 0.5;
    fill: magenta
  }
`;

export const SocialsButton = styled.a`
  background: transparent;
  color: white;
`;

export const SocialsButtonKleidi = styled.a`
  background: transparent;
  color: white;
  margin-left: 100px;
`;

export const SocialsButtonUntai = styled.a`
  background: transparent;
  color: white;
  margin-left: 110px;
`;

export const SocialsButtonPacomang = styled.a`
  background: transparent;
  color: white;
  margin-left: 40px;
`;

export const SocialsButtonAnna = styled.a`
  background: transparent;
  color: white;
  margin-left: 125px;
`;

export const RocketIcon = styled(Rocket)`
  color: white;
  height: 40px;
  width: 40px;
`;

export const Portfolio = styled(Link45deg)`
  width: 50px;
  height: 50px;
  transition: fill 0.25s;

  &:hover {
    fill: #00e600;
  }

`;

export const LinkedIn = styled(LinkedinSquare)`
  width: 50px;
  height: 50px;
  transition: fill 0.25s;

  &:hover {
    fill: #00e600;
  }

`;

export const Git = styled(Github)`
  width: 50px;
  height: 50px;
  transition: fill 0.25s;

  &:hover {
    fill: #00e600;
  }

`;

export const Ig = styled(Instagram)`
  width: 50px;
  height: 50px;
  transition: fill 0.25s;

  &:hover {
    fill: #00e600;
  }

`;

export const Discord = styled(DiscordAlt)`
  position: fixed;
  bottom: 15px;
  right: 15px;
  border
  width: 50px;
  height: 50px;
  transition: fill 0.25s;
  color: white;


  &:hover {
    fill: #00e600;
  }


`;

export const TwitterIcon = styled(Twitter)`
  position: fixed;
  bottom: 15px;
  right: 66px;
  border
  width: 50px;
  height: 50px;
  transition: fill 0.25s;
  color: white;


  &:hover {
    fill: #00e600;
  }

`;
