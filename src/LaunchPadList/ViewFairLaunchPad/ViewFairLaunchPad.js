import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Container, Grid } from "@mui/material";
import About from "./About";
import Contributers from "./Contributers";
import Affiliateprogram from "./Affiliateprogram";
import Tokennomics from "./Tokennomics";
import FAQ from "./FAQ";
import Footer from "../../LandingPage/Footer/Footer";
import Timerpad from "./Timerpad";
import VerticalStepper from "./Stepper";
import NewsletterAccordion from "./Newsletter";
import DiscussionForum from "./DiscussionForum";
import { useLocation } from "react-router-dom";
import {
  FairLaunchPadDetailsHandler,
  FairtimestampsHandler,
  fairAffiliateInfoHandler,
  fairGetTotalParticipantCountHAndler,
  fairContributerDetailHandler,
  FairtotalInvestedETHHandler,
  FairgetSaleStatusHandler,
  fairgetBuyBackRemainAmount,
  currentTokenRateHandler,
  FairgetUserInvesmentAmountHandler,
  fairbuybackAndBurnHandler,
} from "../../ContractAction/FairLaunchPadAction";
import useGetTokenDetails from "../../Hooks/GetTokenDetails";
import { getOwnerHandler } from "../../ContractAction/AirDropContractAction";
import { useCurrentAccountAddress } from "../../Hooks/AccountAddress";
import OwnerZone from "./Ownerzone";
import { useParams } from "react-router-dom";
import { useGlobalState } from "../../Context/GlobalStateContext";
import BuyBackInfo from "./BuyBackInfo";
import {
  fairgetSponserRewardAmountAction,
  fairgettorewardHandler,
  FairisSoftcapReachedAction,
  fairgetPoolBuyBackInfoHandler,
  FairgetIsSponsorClaimedHandler,
} from "../../ContractAction/FairLaunchPadAction";
import {
  getTokenDecimals,
  getNetworkConfig,
  getTokenDetails,
} from "../../ContractAction/ContractDependency";
import { getPoolDetails } from "../ViewFairLaunchPad/ApiViewfairLaunchHandler";
import toast from "react-hot-toast";
const ViewFairLaunchPad = () => {
  const location = useLocation();
  const [poolDetails, setPoolDetails] = useState();
  const [tokenDetails, setTokenDetails] = useState();
  const [timeDetails, setTimeDetails] = useState();
  const [particip, setParticip] = useState();
  const [saleStatus, setSaleStatus] = useState();
  const [tokens, setTokens] = useState();
  const [eth, setEth] = useState();
  const [owner, setOwner] = useState();
  const [contributerDetails, setContributerDetails] = useState();
  const [update, setUpdate] = useState(false);
  const [affiliate, setAffiliate] = useState();
  const [sponserdata, setSponserdata] = useState();
  const [reward, setReward] = useState();
  const [purchased, setPurchased] = useState();
  const [rewardData, setRewardData] = useState();
  const [buyBackInfo, setBuyBackInfo] = useState();
  const [buybackremainamount, setBuybackremainamount] = useState();
  const [decimals, setDecimals] = useState();
  const [isNative, setIsNative] = useState();
  const [currencyDecimal, setCurrencyDecimal] = useState();
  const [currencySymbol, setCurrencySymbol] = useState();
  const [isSoftCapStatus, setIsSoftCapStatus] = useState();
  const [media, setMedia] = useState();
  const [getClaimStatus, setGetClaimStatus] = useState();
  const fetchTokenDetails = useGetTokenDetails();
  const { launchpadAddress } = useParams();

  // Memoize poolAddr to prevent unnecessary re-renders
  const poolAddr = useMemo(() => {
    return location?.state?.data || launchpadAddress;
  }, [location?.state?.data, launchpadAddress]);

  const tokenAddress = location?.state?.tokenAddress;
  const currencyAddress = location?.state?.currencyAddress;
  console.log("state-data", tokenAddress, currencyAddress);
  const account = useCurrentAccountAddress();
  const { timeUp } = useGlobalState();

  console.log("poolAddr", poolAddr);

  // Memoize statusMap since it never changes
  const statusMap = useMemo(
    () => ({
      0: "Cancelled",
      1: "Upcoming",
      2: "Live",
      3: "Ended",
    }),
    []
  );
  useEffect(() => {
    const fetchPoolDetails = async () => {
      try {
        const media = await getPoolDetails(poolAddr);
        console.log("media", media[0]);
        if (media[0]?.ChainId) {
          console.log("KJJKFUKFJF", media[0]?.ChainId);
          // await chainSwitchNetwork(media[0].ChainId);
        }
        setMedia(media[0]);
      } catch (error) {
        console.error("Failed to fetch pool details:", error);
      }
    };
    if (poolAddr) {
      fetchPoolDetails();
    }
  }, [poolAddr]);
  useEffect(() => {
    const fetchPoolDetails = async () => {
      let poolDetails;
      let currencyDecimals;
      let decimals;

      try {
        if (tokenAddress && currencyAddress) {
          const native =
            currencyAddress === "0x0000000000000000000000000000000000000000";
          setIsNative(native);
          console.log("dkjf", native); // this will be accurate

          decimals = await getTokenDecimals(tokenAddress);
          currencyDecimals = native
            ? 18
            : await getTokenDecimals(currencyAddress);

          setDecimals(decimals);
          setCurrencyDecimal(currencyDecimals);

          poolDetails = await FairLaunchPadDetailsHandler(
            poolAddr,
            decimals,
            currencyDecimals
          );
          console.log("fairpoolDetails", poolDetails);
          setPoolDetails(poolDetails);
        } else {
          poolDetails = await FairLaunchPadDetailsHandler(poolAddr, null, null);
          console.log("fairpoolDetails", poolDetails);
          setPoolDetails(poolDetails);

          if (poolDetails?.tokenAddress && poolDetails?.currencyAddress) {
            const native =
              poolDetails.currencyAddress ===
              "0x0000000000000000000000000000000000000000";
            setIsNative(native);

            decimals = await getTokenDecimals(poolDetails.tokenAddress);
            currencyDecimals = native
              ? 18
              : await getTokenDecimals(poolDetails.currencyAddress);

            setDecimals(decimals);
            setCurrencyDecimal(currencyDecimals);

            // Re-fetch the pool details with proper decimals
            poolDetails = await FairLaunchPadDetailsHandler(
              poolAddr,
              decimals,
              currencyDecimals
            );
            console.log("fairpoolDetails (refetched)", poolDetails);
            setPoolDetails(poolDetails);
          }
        }

        if (poolDetails?.tokenAddress) {
          const tokenInfo = await fetchTokenDetails(poolDetails.tokenAddress);
          setTokenDetails(tokenInfo);
          console.log("Updated tokenDetails1:", tokenInfo);
        }

        const particip = await fairGetTotalParticipantCountHAndler(poolAddr);
        console.log("fairparticip", particip);
        setParticip(particip);

        const tokens = await currentTokenRateHandler(poolAddr, decimals);
        console.log("tokens", tokens);
        setTokens(tokens);

        const eth = await FairtotalInvestedETHHandler(
          poolAddr,
          currencyDecimals
        );
        console.log("eth", eth);
        setEth(eth);

        const owner = await getOwnerHandler(poolAddr);
        console.log("owner", owner);
        setOwner(owner === account);

        const saleStatus = await FairgetSaleStatusHandler(poolAddr);
        console.log("saleStatus", saleStatus);
        const readableStatus = statusMap[saleStatus] || "Unknown";
        setSaleStatus(readableStatus);

        const isSoftCapStatus = await FairisSoftcapReachedAction(poolAddr);
        console.log("isSoftCapStatus", isSoftCapStatus);
        setIsSoftCapStatus(isSoftCapStatus);
      } catch (error) {
        console.error("Failed to fetch pool details:", error);
        setSaleStatus("Error");
      }
    };

    if (poolAddr) fetchPoolDetails();
  }, [poolAddr, update, account]); // Removed timeUp and currencyAddress to prevent excessive refetching

  useEffect(() => {
    const fetchTimeDetails = async () => {
      try {
        const details = await FairtimestampsHandler(poolAddr);
        console.log("tdetails", details);
        setTimeDetails(details);
      } catch (error) {
        console.error("Failed to fetch time details:", error);
      }
    };

    if (poolAddr) fetchTimeDetails();
  }, [poolAddr, update]);

  useEffect(() => {
    const fetchContributorDetails = async () => {
      try {
        console.log("fetchContributorDetails", particip, poolAddr);
        if (particip && poolAddr) {
          const contributerDetails = await fairContributerDetailHandler(
            poolAddr,
            particip,
            currencyDecimal
          );
          console.log("contributerDetails", contributerDetails);
          setContributerDetails(contributerDetails);
        }
      } catch (error) {
        console.error("Failed to fetch contributor details:", error);
      }
    };

    fetchContributorDetails();
  }, [poolAddr, particip, update]);

  useEffect(() => {
    const fetchAffiliateInfo = async () => {
      try {
        const data = await fairAffiliateInfoHandler(poolAddr, currencyDecimal);
        console.log("fairdata", data);
        setAffiliate(data);
        // const sponserdata = await getAllSponesersHandler(poolAddr, account);
        // console.log("sponserdata", sponserdata);
        // setSponserdata(sponserdata);
        const yourReward = await fairgetSponserRewardAmountAction(
          poolAddr,
          account,
          currencyDecimal
        );
        console.log("yourReward", yourReward);
        setReward(yourReward);
        // const dummy = await getAllSponesersHandler(poolAddr, account);
        // console.log("dummy", dummy);
      } catch (error) {
        console.error("Failed to fetch affiliate info:", error);
      }
    };

    fetchAffiliateInfo();
  }, [poolAddr, update, currencyDecimal, account]); // Removed timeUp to prevent constant refetching

  useEffect(() => {
    const fetchData = async () => {
      const value = await FairgetUserInvesmentAmountHandler(
        poolAddr,
        account,
        currencyDecimal
      );
      console.log("fairvalue", value);
      setPurchased(value);
    };
    const getClaimStatus = async () => {
      const getClaim = await FairgetIsSponsorClaimedHandler(poolAddr, account);
      setGetClaimStatus(getClaim);
    };
    getClaimStatus();
    fetchData();
  }, [poolAddr, account, update, currencyDecimal]); // Add dependencies here
  useEffect(() => {
    const getSponsorAddressHandler = async () => {
      const sponsor = await fairgettorewardHandler(poolAddr, currencyDecimal);
      console.log("fairgettorewardHandler", sponsor);
      setRewardData(sponsor);
    };
    getSponsorAddressHandler();
  }, [update, currencyDecimal]);
  const fetchBuyBackInfo = async () => {
    try {
      const buybackInfo = await fairgetPoolBuyBackInfoHandler(
        poolAddr,
        currencyDecimal
      );
      console.log("buybackInfo", poolAddr, currencyDecimal);
      setBuyBackInfo(buybackInfo);
      const buybackremainamount = await fairgetBuyBackRemainAmount(
        poolAddr,
        currencyDecimal
      );
      console.log("buybackremainamount", typeof buybackremainamount);
      setBuybackremainamount(buybackremainamount);
    } catch (error) {
      console.error("Error fetching buyback info:", error);
    }
  };
  useEffect(() => {
    fetchBuyBackInfo();
  }, [poolAddr, update, currencyDecimal]); // optionally include poolAddr if it's dynamic

  useEffect(() => {
    const fetchCurrencySymbol = async () => {
      try {
        const config = await getNetworkConfig();
        const currentCurrency = currencyAddress ?? poolDetails?.currencyAddress;

        if (currentCurrency === "0x0000000000000000000000000000000000000000") {
          setCurrencySymbol(config?.nativeToken);
        } else {
          const tokenInfo = await getTokenDetails(currentCurrency);
          setCurrencySymbol(tokenInfo?.symbol || config?.nativeToken); // fallback
        }
      } catch (error) {
        console.error("Error fetching currency symbol:", error);
        setCurrencySymbol("N/A");
      }
    };
    if (currencyAddress || poolDetails?.currencyAddress) {
      fetchCurrencySymbol();
    }
  }, [currencyAddress, poolDetails]);

  console.log("currencySymbol", currencySymbol);
  const fairbuybackAndBurnHan = async () => {
    const tx = await fairbuybackAndBurnHandler(poolAddr);
    if (tx) {
      toast.success("Buyback successful");
    }
    await fetchBuyBackInfo();
  };

  return (
    <Container sx={{ pt: 4, pb: 4 }}>
      <Grid container spacing={4}>
        {/* Left Section */}
        <Grid item lg={8} md={7} sm={12} xs={12}>
          <About
            poolDetails={poolDetails}
            tokenDetails={tokenDetails}
            poolAddr={poolAddr}
            timeDetails={timeDetails}
            saleStatus={saleStatus}
            currencySymbol={currencySymbol}
            media={media}
          />
          <Contributers
            particip={particip}
            contributerDetails={contributerDetails}
            isNative={isNative}
            currencySymbol={currencySymbol}
          />
          {poolDetails?.affiliate === true && (
            <Affiliateprogram
              affiliate={affiliate}
              reward={reward}
              rewardData={rewardData}
              currencySymbol={currencySymbol}
              media={media}
              poolAddr={poolAddr}
              setUpdate={setUpdate}
              getClaimStatus={getClaimStatus}
            />
          )}{" "}
          <Tokennomics />
          <FAQ />
          {/* <DiscussionForum /> */}
        </Grid>

        {/* Right Section */}
        <Grid item lg={4} md={5} sm={12} xs={12}>
          <Timerpad
            poolDetails={poolDetails}
            tokenDetails={tokenDetails}
            poolAddr={poolAddr}
            timeDetails={timeDetails}
            saleStatus={saleStatus}
            eth={eth}
            setUpdate={setUpdate}
            update={update}
            purchased={purchased}
            decimals={decimals}
            currencySymbol={currencySymbol}
            isNative={isNative}
            currencyAddress={currencyAddress || poolDetails?.currencyAddress}
            isSoftCapStatus={isSoftCapStatus}
          />
          <VerticalStepper
            poolDetails={poolDetails}
            tokenDetails={tokenDetails}
            poolAddr={poolAddr}
            timeDetails={timeDetails}
            particip={particip}
            saleStatus={saleStatus}
            tokens={tokens}
            eth={eth}
            purchased={purchased}
            currencySymbol={currencySymbol}
          />
          {owner && (
            <OwnerZone
              poolDetails={poolDetails}
              timeDetails={timeDetails}
              poolAddr={poolAddr}
              saleStatus={saleStatus}
              setUpdate={setUpdate}
              update={update}
              currencySymbol={currencySymbol}
              isSoftCapStatus={isSoftCapStatus}
            />
          )}
          {poolDetails?.isBuyBackEnabled === true && (
            <BuyBackInfo
              buyBackInfo={buyBackInfo}
              buybackremainamount={buybackremainamount}
              fairbuybackAndBurnHan={fairbuybackAndBurnHan}
              currencySymbol={currencySymbol}
            />
          )}{" "}
          {/* <NewsletterAccordion /> */}
        </Grid>
      </Grid>

      <Footer />
    </Container>
  );
};

export default ViewFairLaunchPad;
