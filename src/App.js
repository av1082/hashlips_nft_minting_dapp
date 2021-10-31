import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import "./App.css";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import { Link } from "react-scroll";
import Collapsible from "react-collapsible";
import CountDownTimer from './components/Countdown'
import logo from "./styles/Billie.gif"
import banner from "./styles/Banner.png"
import Anna from "./styles/Anna.jpg"
import Kleidi from "./styles/Kleidi.jpg"
import Gilmo from "./styles/Gilmo.png"
import Untai from "./styles/Untai.png"
import ImageSlider from "./components/ImageSlider";
import {SliderData} from "./components/SliderData"


const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  max-width: 100%;
  padding: 15px;
  border-radius: 10px;
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

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: #950bf1;
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 200px;
  @media (min-width: 767px) {
    width: 300px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px dashed var(--secondary);
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;

const deadline = '2021-10-31';

function getTimeRemaining(endtime){
  const total = Date.parse(endtime) - Date.parse(new Date());
  const seconds = Math.floor( (total/1000) % 60 );
  const minutes = Math.floor( (total/1000/60) % 60 );
  const hours = Math.floor( (total/(1000*60*60)) % 24 );
  const days = Math.floor( total/(1000*60*60*24) );

  return {
    total,
    days,
    hours,
    minutes,
    seconds
  };
}

function App() {

  const daysHoursMinSecs = {days: getTimeRemaining(deadline).days, hours: getTimeRemaining(deadline).hours, minutes: getTimeRemaining(deadline).minutes, seconds: getTimeRemaining(deadline).seconds}

  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(``);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 10) {
      newMintAmount = 10;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <div class="body">

      <div class="header">
        <div style={{display: "flex", flexDirection: "row", alignSelf: "flex-end", justifyContent: "space-between", flexWrap: "reverse"}}>
        <div>
          <Link to="about" spy={true} smooth={true}>
          <s.HeaderButton>About</s.HeaderButton>
          </Link>
        </div>

        {/* <Link to="rarities" spy={true} smooth={true}>
        <s.HeaderButton>Rarities</s.HeaderButton>
        </Link> */}
        <div>
          <Link to="roadmap" spy={true} smooth={true}>
          <s.HeaderButton>Roadmap</s.HeaderButton>
          </Link>
        </div>
        <div>
          <Link to="faq" spy={true} smooth={true}>
          <s.HeaderButton>FAQ </s.HeaderButton>
          </Link>
        </div>
        <div>
          <Link to="team" spy={true} smooth={true}>
          <s.HeaderButton>Team</s.HeaderButton>
          </Link>
        </div>
      </div>
      </div>

      <s.Container flex={1} ai={"flex-start"} jc={"flex-start"} style={{borderBottom: "0.5em solid #00e600"}}>
        <div style={{marginTop: 80, marginLeft: "5%"}}>
            <div class="subtitle" style={{fontWeight: 600}}>
              <span style={{color: "gray"}}>CRYPTO</span><span style={{color: "#00e600"}}>BILLIES</span>
            </div>
        </div>
        <s.SpacerMedium/>


        <div style={{paddingLeft: "5%", paddingRight: 60, paddingTop: 20}}>
          <div className="title"><span style={{color: "white", fontWeight: 400}}>10,000 BILLIES LIVING ON</span> <span style={{color: "#950bf1", fontWeight: 800}}>ETHEREUM</span>
            </div>
          <s.SpacerSmall/>
          <s.SpacerSmall/>
          <s.SpacerSmall/>
          <div style={{display: "flex", flexDirection: "column", alignSelf: "center"}}>
          <div class="soon">MINTING IS OPEN!</div>

          </div>

          <s.Container
            flex={2}
            jc={"center"}
            ai={"center"}
            style={{
              backgroundColor: "transparent",
              padding: 24
            }}
          >
            <s.SpacerSmall />
            {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "white" }}
                >
                  The sale has ended.
                </s.TextTitle>
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  You can still find {CONFIG.NFT_NAME} on
                </s.TextDescription>
                <s.SpacerSmall />
                <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                  {CONFIG.MARKETPLACE}
                </StyledLink>
              </>
            ) : (
              <>
                <s.SpacerSmall />
                {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  <s.Container ai={"center"} jc={"center"}>
                    <s.SpacerSmall />
                    <StyledButton
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }}
                    >
                      <div class="subtitle" style={{color: "white", letterSpacing: "0.2em", fontWeight: "600"}}>CONNECT</div>
                    </StyledButton>
                    {blockchain.errorMsg !== "" ? (
                      <>
                        <s.SpacerSmall />
                        <div class="description" style={{alignSelf: "center"}}>
                          {blockchain.errorMsg}
                        </div>
                      </>
                    ) : null}
                  </s.Container>
                ) : (
                  <>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      {feedback}
                    </s.TextDescription>
                    <s.SpacerSmall />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledRoundButton
                        style={{ lineHeight: 0.4, marginRight: 20 }}
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          decrementMintAmount();
                        }}
                      >
                        -
                      </StyledRoundButton>
                      <s.SpacerMedium />
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                        }}
                      >
                        {mintAmount}
                      </s.TextDescription>
                      <s.SpacerMedium />
                      <StyledRoundButton
                        disabled={claimingNft ? 1 : 0}
                        style={{marginLeft: 20}}
                        onClick={(e) => {
                          e.preventDefault();
                          incrementMintAmount();
                        }}
                      >
                        +
                      </StyledRoundButton>
                    </s.Container>
                    <s.SpacerSmall />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledButton
                        disabled={claimingNft ? 1 : 0}
                        style={{color: "white", letterSpacing: "0.2em", fontSize: "20px", fontWeight: "600"}}
                        onClick={(e) => {
                          e.preventDefault();
                          claimNFTs();
                          getData();
                        }}
                      >
                        {claimingNft ? "BUSY" : "MINT"}
                      </StyledButton>
                    </s.Container>
                    <s.SpacerSmall/>
                    <s.SpacerSmall/>
                    <div class="subtitle" style={{alignSelf: "center", color: "white", letterSpacing: "0.2em"}}>
                      SOLD: {data.totalSupply} / {CONFIG.MAX_SUPPLY}
                    </div>
                  </>

                )}
              </>
            )}
            <s.SpacerMedium />
          </s.Container>
        </div>
        <img src={banner} alt="Banner" style={{maxWidth: "100%"}}/>
      </s.Container>

      <div id="about" class="about">
        <div class="subtitle" style={{marginBottom: 80, fontWeight: 600}}>METAVERSE</div>
          <div>
            <img src={logo} alt="Logo" style={{border: "2px solid #00e600", borderRadius: 30, width: "300px", height: "300px", alignSelf: "center", marginBottom: 40}}/>
          </div>
          <div style={{display: "flex", flexDirection: "column", justifyContent: "space-around"}}>
          <div class="story" style={{marginBottom: 60}}>"In late 2021, the Billie Universe began to unravel.  A wormhole tore open the fabric of space and time, ripped the Billies from their home and sent them to the Metaverse. The Humans of Earth have finally discovered the secrets of the Metaverse and can now access them through the blockchain. 10,000 Billies lie dormant in this plane waiting to be released. Will you be the hero to free a Billie from the Metaverse..."
          </div>

          <div class="description" style={{marginBottom: 40}}>
            Every Billie minted is created algorithmically on the ERC-721 token. No two Billies are the same. Once minted, each Billie will live on the blockchain indefinitely and cannot be altered.
          </div>

          <div class="description">Below is the pricing schedule. Each new wave will unlock after the previous one sells out.</div>

          <table class="styled-table">
            <thead>
                <tr>
                    <th>Wave</th>
                    <th># of NFTs</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>
                <tr style={{textDecoration: "line-through"}}>
                    <td>1</td>
                    <td>1-50</td>
                    <td>Reserved</td>
                </tr>
                <tr className="active-row">
                    <td>2</td>
                    <td>51-300</td>
                    <td>0.02 ETH</td>
                </tr>
                <tr>
                    <td>3</td>
                    <td>301-1500</td>
                    <td>0.04 ETH</td>
                </tr>
                <tr>
                    <td>4</td>
                    <td>1501-5000</td>
                    <td>0.08 ETH</td>
                </tr>
                <tr>
                    <td>5</td>
                    <td>5001-7500</td>
                    <td>0.12 ETH</td>
                </tr>
                <tr>
                    <td>6</td>
                    <td>7501-9950</td>
                    <td>0.20 ETH</td>
                </tr>
                <tr>
                    <td>7</td>
                    <td>9951-10000</td>
                    <td>0.50 ETH</td>
                </tr>
            </tbody>
        </table>
          </div>

      </div>

      <s.ContainerTwo id="rarities" ai={"center"} style={{backgroundColor: "transparent", paddingLeft: 20, paddingRight: 20, borderBottom: "0.2em solid #00e600", borderTop: "0.2em solid #00e600" }}>
          <div class="subtitle" style={{alignSelf: "center", color: "white", fontSize: "20px"}}>
            {/* <img src={Rarities} alt="Rarities" style={{maxWidth: "100%", marginTop: 40}}/> */}
            RARITIES COMING SOON!
          </div>
          {/* <ImageSlider slides={SliderData} />
          <s.SpacerSmall/> */}
        </s.ContainerTwo>

      <div id="roadmap" class="roadmap">

        <div class="subtitle" style={{fontWeight: 600}}>ROADMAP</div>
          <s.SpacerMedium />


          <s.Container fd={"row"} ai={"center"} jc={"flex-start"}>
          <s.Container fd={"row"} ai={"center"} jc={"flex-start"}>

          <s.SpacerSmall/>
          <div class="subtitle" style={{backgroundColor: "transparent", color: "white", marginRight: 40}}>
          [10%]
          </div>
          <s.SpacerSmall/>
          </s.Container>
          <div class="description">1 ether total will be given to whitelisted members
          </div>
          </s.Container>
          <s.SpacerSmall/>
          <s.Container fd={"row"} ai={"center"} jc={"flex-start"}>

          <s.Container fd={"row"} ai={"center"} jc={"flex-start"}>

          <s.SpacerSmall/>
          <div class="subtitle" style={{backgroundColor: "transparent", color: "white", marginRight: 35}}>
          [20%]
          </div>
          <s.SpacerSmall/>
          </s.Container>
          <div class="description">20 Billies raffled to members
          </div>
          </s.Container>
          <s.SpacerSmall/>
          <s.Container fd={"row"} ai={"center"} jc={"flex-start"}>


          <s.Container fd={"row"} ai={"center"} jc={"flex-start"}>

          <s.SpacerSmall/>
          <div class="subtitle" style={{backgroundColor: "transparent", color: "white", marginRight: 35}}>
          [30%]
          </div>
          <s.SpacerSmall/>
          </s.Container>

          <div class="description">30 winners, $15,000 total given to members
          </div>
          </s.Container>

          <s.SpacerSmall/>
          <s.Container fd={"row"} ai={"center"} jc={"flex-start"}>


          <s.Container fd={"row"} ai={"center"} jc={"flex-start"}>

          <s.SpacerSmall/>
          <div class="subtitle" style={{backgroundColor: "transparent", color: "white", marginRight: 35}}>
          [40%]
          </div>
          <s.SpacerSmall/>
          </s.Container>

          <div class="description">4 ether used to sweep the floor
          </div>
          </s.Container>

          <s.SpacerSmall/>
          <s.Container fd={"row"} ai={"center"} jc={"flex-start"}>
          <s.Container fd={"row"} ai={"center"} jc={"flex-start"}>

          <s.SpacerSmall/>
          <div class="subtitle" style={{backgroundColor: "transparent", color: "white", marginRight: 35}}>
          [50%]
          </div>
          <s.SpacerSmall/>
          </s.Container>
          <div class="description">$50,000 donated to mental health charity
          </div>
          </s.Container>

          <s.SpacerSmall/>
          <s.Container fd={"row"} ai={"center"} jc={"flex-start"}>
          <s.Container fd={"row"} ai={"center"} jc={"flex-start"}>

          <s.SpacerSmall/>
          <div class="subtitle" style={{backgroundColor: "transparent", color: "white", marginRight: 35}}>
          [60%]
          </div>
          <s.SpacerSmall/>
          </s.Container>
          <div class="description">600 free merch with your CryptoBillie
          </div>
          </s.Container>

          <s.SpacerSmall/>
          <s.Container fd={"row"} ai={"center"} jc={"flex-start"}>
          <s.Container fd={"row"} ai={"center"} jc={"flex-start"}>

          <s.SpacerSmall/>
          <div class="subtitle" style={{backgroundColor: "transparent", color: "white", marginRight: 38}}>
          [70%]
          </div>
          <s.SpacerSmall/>
          </s.Container>
          <div class="description">7 members will design their own CryptoBillie
          </div>
          </s.Container>

          <s.SpacerSmall/>
          <s.Container fd={"row"} ai={"center"} jc={"flex-start"}>
          <s.Container fd={"row"} ai={"center"} jc={"flex-start"}>

          <s.SpacerSmall/>
          <div class="subtitle" style={{backgroundColor: "transparent", color: "white", marginRight: 35}}>
          [80%]
          </div>
          <s.SpacerSmall/>
          </s.Container>
          <div class="description">8 members awarted with concert tickets to Happier Than Ever, The World Tour
          </div>
          </s.Container>

          <s.SpacerSmall/>
          <s.Container fd={"row"} ai={"center"} jc={"flex-start"}>
          <s.Container fd={"row"} ai={"center"} jc={"flex-start"}>

          <s.SpacerSmall/>
          <div class="subtitle" style={{backgroundColor: "transparent", color: "white", paddingRight: 35}}>
          [90%]
          </div>
          <s.SpacerSmall/>
          </s.Container>
          <div class="description">9 ether to sweep the floor
          </div>
          </s.Container>

          <s.SpacerSmall/>
          <s.Container fd={"row"} ai={"center"} jc={"flex-start"}>
          <s.Container fd={"row"} ai={"center"} jc={"flex-start"}>

          <s.SpacerSmall/>
          <div class="subtitle" style={{backgroundColor: "transparent", color: "white", paddingRight: 10}}>
            [100%]
          </div>
          <s.SpacerSmall/>
          </s.Container>
          <div class="description">50% of ALL royalty proceeds back to members
          </div>
          </s.Container>
          </div>

      <div id="faq" class="faq">
          <div class="subtitle" style={{fontWeight: 600}}>
            FAQ IT UP!
          </div>
          <s.SpacerMedium />
          <Collapsible
          className="description"
          openedClassName="description"
          triggerOpenedClassName="faqDetails"
          triggerStyle={{letterSpacing: "0.1em"}}
          tabIndex={0}
          trigger="What are NFTs?">
            <p className="description" style={{paddingTop: 10}}>
              At a very high level, Non-fungible tokens / NFTs are items, such as artwork, that have been stored in the blockchain network. Once stored, these items cannot be changed or replaced. Hence, once created, the item lives in the network forever.
            </p>
          </Collapsible>
          <s.SpacerSmall />
          <s.SpacerSmall />
          <Collapsible
          className="description"
          openedClassName="description"
          triggerOpenedClassName="faqDetails"
          triggerStyle={{letterSpacing: "0.1em"}}
          tabIndex={0}
          trigger="What is minting?">
            <p className="description" style={{paddingTop: 10}}>
            Minting is the process of creating a digital artwork to make it part of the blockchain. Our devs have coded the smart contract which allows anyone with a MetaMask account to mint the NFT straight from our website.
            </p>
          </Collapsible>
          <s.SpacerSmall />
          <s.SpacerSmall />
          <Collapsible
          className="description"
          openedClassName="description"
          triggerOpenedClassName="faqDetails"
          triggerStyle={{letterSpacing: "0.1em"}}
          tabIndex={0}
          trigger="When can I mint?">
            <p className="description" style={{paddingTop: 10}}>
             October 30th at 12PM EDT (NYC, USA TIME)
            </p>
          </Collapsible>
          <s.SpacerSmall />
          <s.SpacerSmall />
          <Collapsible
          className="description"
          openedClassName="description"
          triggerOpenedClassName="faqDetails"
          triggerStyle={{letterSpacing: "0.1em"}}
          tabIndex={0}
          trigger="How many CryptoBillies in total can be minted?">
            <p className="description" style={{paddingTop: 10}}>
              10,000
            </p>
          </Collapsible>
          <s.SpacerSmall />
          <s.SpacerSmall />
          <Collapsible
          className="description"
          openedClassName="description"
          triggerOpenedClassName="faqDetails"
          triggerStyle={{letterSpacing: "0.1em"}}
          tabIndex={0}
          trigger="What is the price of one mint?">
            <p className="description" style={{paddingTop: 10}}>
              The first 250 NFTs will be sold at 0.02 ETH. The price will increase with each wave of NFTs sold - so keep your eyes peeled!
            </p>
          </Collapsible>
          <s.SpacerSmall />
          <s.SpacerSmall />
          <Collapsible
          className="description"
          openedClassName="description"
          triggerOpenedClassName="faqDetails"
          triggerStyle={{letterSpacing: "0.1em"}}
          tabIndex={0}
          trigger="How many can I mint?">
            <p className="description" style={{paddingTop: 10}}>
              Up to 10 MAX per account
            </p>
          </Collapsible>
          <s.SpacerSmall />
          <s.SpacerSmall />
        </div>

      <div id="team" className="team">
          <div className="subtitle" style={{fontWeight: 600}}>
            TEAM
          </div>
          <s.SpacerMedium />

          <s.Billies style={{alignItems: "center", flexWrap: "wrap", padding: 10}}>

            <div style={{padding: 20}}>
              <img src={Kleidi} alt="Logo" style={{borderRadius: 40, border: "3px solid #00e600", width: 250, height: 250}}/>
              <s.TextDescription style={{color: "white", backgroundColor: "transparent", fontWeight: 600}}>KLEIDI
              <s.SocialsButtonKleidi href="https://www.linkedin.com/in/kleidimico/" target="_blank">
              <s.LinkedIn/>
              </s.SocialsButtonKleidi>
              <div style={{fontSize: 25, fontWeight: 500}}>Project Lead
              </div>
              </s.TextDescription>
            </div>

            <div style={{padding: 20}}>
            <img src={Untai} alt="Logo" style={{borderRadius: 40, border: "3px solid #00e600", width: 250, height: 250}}/>
            <s.SpacerXSmall/>
              <s.TextDescription style={{alignSelf: "center", color: "white", fontWeight: 600 }}>UNTAI
              <s.SocialsButtonUntai href="https://www.untaikisah.com/" target="_blank">
                <s.Portfolio />
              </s.SocialsButtonUntai>
              <div style={{fontSize: 25, fontWeight: 500}}>Illustrator</div>
              </s.TextDescription>
            </div>

            <div style={{padding: 20}}>
            <img src={Gilmo} alt="Logo" style={{borderRadius: 40, border: "3px solid #00e600", width: 250, height: 250}}/>
            <s.SpacerXSmall/>
              <s.TextDescription style={{alignSelf: "center", color: "white", fontWeight: 600 }}>PACOMANG
              <s.SocialsButtonPacomang href="https://www.instagram.com/papacocomama/" target="_blank">
              <s.Ig/>
              </s.SocialsButtonPacomang>
              <div style={{fontSize: 25, fontWeight: 500}}>Illustrator</div>
              </s.TextDescription>
            </div>

            <div style={{padding: 20}}>
            <img src={Anna} alt="Logo" style={{borderRadius: 40, border: "3px solid #00e600", width: 250, height: 250}}/>
            <s.SpacerXSmall/>
              <s.TextDescription style={{alignSelf: "center", color: "white", fontWeight: 600 }}>ANYA
              <s.SocialsButtonAnna href="https://github.com/av1082" target="_blank">
              <s.Git/>
              </s.SocialsButtonAnna>
              <div style={{fontSize: 25, fontWeight: 500}}>Developer</div>
              </s.TextDescription>
            </div>
          </s.Billies>
        </div>

        <s.Container id="footer" style={{ flex: 1, alignItems: "flex-start", padding: 30}}>
        <div className="description" style={{fontSize: "20px"}}>© 2021 CryptoBillies</div>
        </s.Container>

      <s.SocialsButton href="https://twitter.com/NFTBillies" target="_blank">
        <s.TwitterIcon />
      </s.SocialsButton>

      <s.SocialsButton href="https://www.instagram.com/cryptobillies/" target="_blank">
        <s.Ig style={{position: "fixed", right: "120px", bottom: "15px"}}/>
      </s.SocialsButton>

      <s.SocialsButton href="https://discord.gg/eWfb82C7RR" target="_blank">
        <s.Discord />
      </s.SocialsButton>
    </div>
  );
}

export default App;
