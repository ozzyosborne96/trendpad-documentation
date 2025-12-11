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
  LaunchPadDetailsHandler,
  timestampsHandler,
  getTotalParticipantCountHAndler,
  getSaleStatusHandler,
  getUnsoldTokensHandler,
  totalInvestedETHHandler,
  contributerDetailHandler,
  affiliateInfoHandler,
  getAllSponesersHandler,
  sponserRewardHandler,
  getUserInvesmentAmountHandler,
  getIsSponsorClaimedHandler,
  TopRewardHandler,
  isSoftcapReachedAction,
} from "../../ContractAction/LaunchPadAction";
import useGetTokenDetails from "../../Hooks/GetTokenDetails";
import { getOwnerHandler } from "../../ContractAction/AirDropContractAction";
import { useCurrentAccountAddress } from "../../Hooks/AccountAddress";
import OwnerZone from "./Ownerzone";
import { useParams } from "react-router-dom";
import { useGlobalState } from "../../Context/GlobalStateContext";
import {
  getNetworkConfig,
  getTokenDetails,
  getTokenDecimals,
  isNativeTokenHandler,
  chainSwitchNetwork,
} from "../../ContractAction/ContractDependency";
import { ethers } from "ethers";
import { getPoolDetails } from "./ApiViewLaunchpadAction";
const ViewLaunchPad = () => {
  const location = useLocation();

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Data states
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
  const [currencySymbol, setCurrencySymbol] = useState();
  const [decimals, setDecimals] = useState();
  const [currencyDecimal, setCurrencyDecimal] = useState();
  const [claimStatus, setClaimStatus] = useState(false);
  const [isNative, setIsNative] = useState();
  const [rewardData, setRewardData] = useState();
  const [media, setMedia] = useState();
  const [isSoftCapStatus, setIsSoftCapStatus] = useState();

  const fetchTokenDetails = useGetTokenDetails();
  const { launchpadAddress } = useParams();

  // Memoize poolAddr to prevent unnecessary re-renders
  const poolAddr = useMemo(() => {
    return location?.state?.data || launchpadAddress;
  }, [location?.state?.data, launchpadAddress]);

  const tokenAddress = location?.state?.tokenAddress;
  const currencyAddress = location?.state?.currencyAddress;
  const account = useCurrentAccountAddress();
  const { timeUp } = useGlobalState();

  // Memoize statusMap since it never changes
  const statusMap = useMemo(
    () => ({
      0: "Cancelled",
      1: "Upcoming",
      2: "Live",
      3: "Filled",
      4: "Ended",
    }),
    []
  );

  // Track if we're currently fetching to prevent duplicate calls
  const [isFetching, setIsFetching] = useState(false);

  // 1. Fetch media/pool metadata (once on mount or when poolAddr changes)
  useEffect(() => {
    const fetchPoolMetadata = async () => {
      try {
        const media = await getPoolDetails(poolAddr);
        console.log("media", media[0]);
        if (media[0]?.ChainId) {
          console.log("KJJKFUKFJF", media[0]?.ChainId);
          // await chainSwitchNetwork(media[0].ChainId);
        }
        setMedia(media[0]);
      } catch (error) {
        console.error("Failed to fetch pool metadata:", error);
      }
    };
    if (poolAddr) {
      if (ethers.isAddress(poolAddr)) {
        fetchPoolMetadata();
      } else {
        console.error("Invalid pool address:", poolAddr);
      }
    }
  }, [poolAddr]); // Only re-run when poolAddr changes

  // 2. Main data fetch - consolidates pool details, token info, and all core blockchain data
  useEffect(() => {
    if (!poolAddr || isFetching) return;

    const fetchAllPoolData = async () => {
      // Validate address before attempting to fetch
      if (!ethers.isAddress(poolAddr)) {
        console.error("Invalid pool address:", poolAddr);
        setSaleStatus("Error");
        return;
      }

      setIsFetching(true);
      let poolDetails;
      let currencyDecimals;

      try {
        // Step 1: Get pool details and decimals
        if (tokenAddress && currencyAddress) {
          const native =
            currencyAddress === "0x0000000000000000000000000000000000000000";
          setIsNative(native);

          const decimals = await getTokenDecimals(tokenAddress);
          currencyDecimals = native
            ? 18
            : await getTokenDecimals(currencyAddress);
          setDecimals(decimals);
          setCurrencyDecimal(currencyDecimals);

          poolDetails = await LaunchPadDetailsHandler(
            poolAddr,
            decimals,
            currencyDecimals
          );
          setPoolDetails(poolDetails);
        } else {
          poolDetails = await LaunchPadDetailsHandler(poolAddr, null, null);
          setPoolDetails(poolDetails);

          if (poolDetails?.tokenAddress && poolDetails?.currencyAddress) {
            const native =
              poolDetails.currencyAddress ===
              "0x0000000000000000000000000000000000000000";
            setIsNative(native);

            const decimals = await getTokenDecimals(poolDetails.tokenAddress);
            currencyDecimals = native
              ? 18
              : await getTokenDecimals(poolDetails.currencyAddress);

            setDecimals(decimals);
            setCurrencyDecimal(currencyDecimals);

            // Re-fetch with proper decimals
            poolDetails = await LaunchPadDetailsHandler(
              poolAddr,
              decimals,
              currencyDecimals
            );
            setPoolDetails(poolDetails);
          }
        }

        // Step 2: Fetch all data in parallel to reduce sequential delays
        const [
          tokenInfo,
          particip,
          timeDetails,
          tokens,
          eth,
          owner,
          saleStatus,
          rewardData,
          isSoftCapStatus,
        ] = await Promise.all([
          poolDetails?.tokenAddress
            ? fetchTokenDetails(poolDetails.tokenAddress)
            : Promise.resolve(null),
          getTotalParticipantCountHAndler(poolAddr),
          timestampsHandler(poolAddr),
          getUnsoldTokensHandler(poolAddr, decimals),
          totalInvestedETHHandler(poolAddr, currencyDecimals),
          getOwnerHandler(poolAddr),
          getSaleStatusHandler(poolAddr),
          TopRewardHandler(poolAddr, currencyDecimals),
          isSoftcapReachedAction(poolAddr),
        ]);

        // Set all state at once
        setTokenDetails(tokenInfo);
        setParticip(particip);
        setTimeDetails(timeDetails);
        setTokens(tokens);
        setEth(eth);
        setOwner(owner === account);
        setSaleStatus(statusMap[saleStatus] || "Unknown");
        setRewardData(rewardData);
        setIsSoftCapStatus(isSoftCapStatus);

        console.log("All pool data fetched successfully");
      } catch (error) {
        console.error("Failed to fetch pool data:", error);
        setSaleStatus("Error");
      } finally {
        setIsFetching(false);
      }
    };

    fetchAllPoolData();
  }, [poolAddr, update, account]); // Removed timeUp to prevent constant refetching

  // 3. Fetch dependent data (contributor details, affiliate info, user investment)
  // Memoize this function to prevent unnecessary recreations
  const fetchDependentData = useCallback(async () => {
    if (!particip || !currencyDecimal || !poolAddr) return;

    try {
      // Fetch contributor details, affiliate info, and user data in parallel
      const [contributerDetails, affiliateData, userInvestment] =
        await Promise.all([
          contributerDetailHandler(poolAddr, particip, currencyDecimal),
          affiliateInfoHandler(poolAddr, currencyDecimal),
          account
            ? getUserInvesmentAmountHandler(poolAddr, account, currencyDecimal)
            : Promise.resolve(null),
        ]);

      setContributerDetails(contributerDetails);
      setAffiliate(affiliateData);
      setPurchased(userInvestment);

      // Fetch affiliate-specific data if user is connected
      if (account && decimals) {
        const [sponserdata, yourReward, claimStatus] = await Promise.all([
          getAllSponesersHandler(poolAddr, account, decimals),
          sponserRewardHandler(poolAddr, account, currencyDecimal),
          getIsSponsorClaimedHandler(poolAddr, account),
        ]);

        setSponserdata(sponserdata);
        setReward(yourReward);
        setClaimStatus(claimStatus);
      }

      console.log("Dependent data fetched successfully");
    } catch (error) {
      console.error("Failed to fetch dependent data:", error);
    }
  }, [particip, currencyDecimal, poolAddr, account, decimals]);

  // Execute the dependent data fetch when dependencies change
  useEffect(() => {
    fetchDependentData();
  }, [poolAddr, particip, currencyDecimal, decimals, account, update]);

  // 4. Fetch currency symbol (once we have currency address)
  useEffect(() => {
    const fetchCurrencySymbol = async () => {
      try {
        const config = await getNetworkConfig();
        const currentCurrency = currencyAddress ?? poolDetails?.currencyAddress;
        if (!currentCurrency) return;

        if (currentCurrency === "0x0000000000000000000000000000000000000000") {
          setCurrencySymbol(config?.nativeToken);
        } else {
          const tokenInfo = await getTokenDetails(currentCurrency);
          setCurrencySymbol(tokenInfo?.symbol || config?.nativeToken);
        }
      } catch (error) {
        console.error("Error fetching currency symbol:", error);
        setCurrencySymbol("N/A");
      }
    };

    if (currencyAddress || poolDetails?.currencyAddress) {
      fetchCurrencySymbol();
    }
  }, [currencyAddress, poolDetails?.currencyAddress]); // Removed timeUp and poolDetails object

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
              poolAddr={poolAddr}
              affiliate={affiliate}
              reward={reward}
              setUpdate={setUpdate}
              update={update}
              currencySymbol={currencySymbol}
              claimStatus={claimStatus}
              media={media}
              rewardData={rewardData}
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
            currencySymbol={currencySymbol}
            decimals={decimals}
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
          <NewsletterAccordion />
        </Grid>
      </Grid>

      <Footer />
    </Container>
  );
};

export default ViewLaunchPad;
