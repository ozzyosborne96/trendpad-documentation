import React, { useEffect, useState } from "react";
import { Button, Box, Typography } from "@mui/material";
import { whitelistEnabledHandler } from "../../ContractAction/LaunchPadAction";
import AddUsersToWhiteList from "../ViewLaunchPad/AddUsersToWhiteList";
import RemoveBatchFromWhitelist from "./RemoveBatchFromWhitelist";
import { Link } from "react-router-dom";
import Finalize from "./Finalize";
import UpdateAffiliate from "./UpdateAffiliate";
import StartEndTimeSetting from "./StartEndTimeSetting";
import {
  cancelSaleHandler,
  withDrawCancelledTokensHandler,
  publicEnableHandler,
  distributedHandler,
  removeBatchFromWhitelistHandler,
} from "../../ContractAction/LaunchPadAction";
import { toast } from "react-hot-toast";
import { FairLaunchTheme } from "../../LaunchPad/CeateFairLaunch/FairLaunchTheme";

const OwnerZone = ({
  timeDetails,
  poolDetails,
  poolAddr,
  saleStatus,
  setUpdate,
  update,
  currencySymbol,
  isSoftCapStatus,
}) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [open2, setOpen2] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [opensed, setOpensed] = useState(false);
  const [isfinalize, setIsFinalize] = useState(false);

  const handleOpen1 = () => setOpen1(true);
  const handleClose1 = () => setOpen1(false);

  const enableWhiteListHandler = async () => {
    try {
      if (poolDetails?.whiteList) {
        toast.error("The sale is already whiteList");
        return;
      }
      const tx = await whitelistEnabledHandler(poolAddr);
      setUpdate((prev) => !prev);
      if (tx) {
        toast.success("Whitelist enabled successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to enable whitelist.");
    }
  };

  const withDrawCancelledTokens = async () => {
    try {
      const tx = await withDrawCancelledTokensHandler(poolAddr);
      setUpdate((prev) => !prev);
      if (tx) {
        toast.success("Cancelled tokens withdrawn successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to withdraw cancelled tokens.");
    }
  };

  const publicEnableClick = async () => {
    try {
      if (!poolDetails?.whiteList) {
        toast.error("The sale is already of public type");
        return;
      }
      const tx = await publicEnableHandler(poolAddr);
      setUpdate((prev) => !prev);
      if (tx) {
        toast.success("Presale is now public!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to make presale public.");
    }
  };

  const removeWhiteListClick = async () => {
    try {
      const tx = await removeBatchFromWhitelistHandler(poolAddr, false);
      if (tx) {
        toast.success("Whitelist removed successfully!");
      }
    } catch (error) {
      console.error("Error removing from whitelist:", error);
      toast.error("Failed to remove from whitelist!");
    }
  };

  useEffect(() => {
    (async () => {
      const isfinalize = await distributedHandler(poolAddr);
      setIsFinalize(isfinalize);
      console.log("isfinalize", isfinalize);
    })();
  }, [poolAddr, update]);

  return (
    <Box
      sx={(theme) => ({
        ...FairLaunchTheme.cardStyle(theme),
        marginBottom: "20px",
      })}
    >
      <Typography
        variant="h5"
        sx={(theme) => ({
          ...FairLaunchTheme.gradientText(theme),
          marginBottom: "12px",
        })}
      >
        Owner Zone
      </Typography>

      <div
        style={{
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ffeeba",
          marginBottom: "16px",
        }}
      >
        <Typography variant="body1" sx={{ color: "rgba(229, 182, 73, 1)" }}>
          To make sure there will be no issues during the presale time, please
          do not send tokens to wallets before you finalize the presale pool.
        </Typography>
      </div>

      <div style={{ marginBottom: "12px" }}>
        <strong>Pool Type</strong>
        <br />
        <Link
          style={{
            color: poolDetails?.whiteList ? "#6c757d" : "#28a745",
            margin: "4px 0",
            fontSize: "12px",
          }}
          onClick={publicEnableClick}
        >
          {poolDetails?.whiteList ? "Public" : "✔ Public"}
        </Link>
        <br />
        <Link
          style={{
            color: poolDetails?.whiteList ? "#28a745" : "#6c757d",
            margin: "4px 0",
            fontSize: "12px",
            cursor: "pointer",
          }}
          onClick={enableWhiteListHandler}
        >
          {poolDetails?.whiteList ? "✔ Whitelist Only" : "Whitelist Only"}
        </Link>

        {poolDetails?.whiteList &&
          (saleStatus === "Upcoming" || saleStatus === "Live") && (
            <div className="flex-col gap-4 mt-4">
              {/* <Button variant='contained'>Update Whitelisting Setting</Button> */}
              {
                <>
                  <Button
                    variant="contained"
                    onClick={handleOpen}
                    sx={(theme) => ({
                      ...FairLaunchTheme.neonButton(theme),
                      fontSize: "14px",
                      padding: "12px 24px",
                      width: "100%",
                      marginBottom: "8px",
                    })}
                  >
                    Add Users to Whitelist
                  </Button>
                  <Button
                    variant="contained"
                    onClick={removeWhiteListClick}
                    sx={(theme) => ({
                      ...FairLaunchTheme.neonButton(theme),
                      fontSize: "14px",
                      padding: "12px 24px",
                      width: "100%",
                    })}
                  >
                    Remove users from whiteList
                  </Button>
                </>
              }
            </div>
          )}
      </div>

      <div style={{ marginBottom: "12px" }}>
        <strong>Pool Fee</strong>
        <p style={{ color: "#28a745", margin: "4px 0" }}>
          3% {currencySymbol} raised only
        </p>
      </div>

      <div style={{ marginBottom: "12px" }}>
        <strong>Time Settings (UTC)</strong>
        <p style={{ margin: "4px 0" }}>Start: {timeDetails?.startTime}</p>
        <p style={{ margin: "4px 0" }}>End: {timeDetails?.endTime}</p>
      </div>

      <div style={{ marginBottom: "12px" }}>
        <strong>Pool Actions</strong>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            marginTop: "8px",
          }}
        >
          <Button
            variant="contained"
            onClick={(e) => setDialogOpen(true)}
            disabled={saleStatus === "Upcoming" ? false : true}
            sx={(theme) => ({
              ...FairLaunchTheme.neonButton(theme),
              fontSize: "14px",
              padding: "12px 24px",
              opacity: saleStatus === "Upcoming" ? 1 : 0.6,
            })}
          >
            Update Affiliate Program
          </Button>
          {(saleStatus === "Live" || saleStatus === "Ended") && (
            <p style={{ color: "gray", fontSize: "12px", margin: 0 }}>
              Cannot update affiliate program at this time
            </p>
          )}
          <Button
            variant="contained"
            onClick={() => setOpensed(true)}
            disabled={saleStatus === "Upcoming" ? false : true}
            sx={(theme) => ({
              ...FairLaunchTheme.neonButton(theme),
              fontSize: "14px",
              padding: "12px 24px",
              opacity: saleStatus === "Upcoming" ? 1 : 0.6,
            })}
          >
            Pool Start/End Time Settings
          </Button>
          <Button
            variant="contained"
            onClick={() => setOpen2(true)}
            disabled={
              isfinalize ||
              !(saleStatus === "Ended" || saleStatus === "Filled") ||
              saleStatus === "Cancelled" ||
              !isSoftCapStatus
            }
            sx={(theme) => ({
              ...FairLaunchTheme.neonButton(theme),
            })}
          >
            Finalize
          </Button>
          {/* <Button variant="contained">Set Claim Time</Button> */}
          <Button
            variant="contained"
            onClick={async () => {
              await cancelSaleHandler(poolAddr);
              setUpdate((prev) => !prev);
            }}
            disabled={isfinalize || saleStatus === "Cancelled"}
            sx={(theme) => ({
              ...FairLaunchTheme.neonButton(theme),
              fontSize: "14px",
              padding: "12px 24px",
            })}
          >
            Cancel Sale
          </Button>
          <Button
            variant="contained"
            disabled={saleStatus !== "Cancelled"}
            sx={(theme) => ({
              ...FairLaunchTheme.neonButton(theme),
              fontSize: "14px",
              padding: "12px 24px",
            })}
            onClick={withDrawCancelledTokens}
          >
            withdraw cancelled tokens
          </Button>
        </div>
      </div>

      <div style={{ marginBottom: "12px", fontSize: "12px", color: "#007bff" }}>
        To Finalize presale, you have to exclude token transfer fee for presale
        contract.
      </div>

      {/* <div>
        <strong>Refund</strong>
        <p style={{ fontSize: "12px", color: "#007bff" }}>
          Click the button below to refund tokens for users. You may need to
          click many times.
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          <span style={{ fontSize: "12px" }}>2 / 1 users</span>
        </div>
        <Button variant="contained" color="error" fullWidth>
          Refund
        </Button>
      </div> */}
      <AddUsersToWhiteList
        open={open}
        handleClose={handleClose}
        poolAddr={poolAddr}
        setUpdate={setUpdate}
        update={update}
      />
      <RemoveBatchFromWhitelist
        open={open1}
        handleClose={handleClose1}
        poolAddr={poolAddr}
        setUpdate={setUpdate}
        update={update}
      />
      <Finalize
        open={open2}
        onClose={() => setOpen2(false)}
        poolAddr={poolAddr}
        setUpdate={setUpdate}
        update={update}
      />
      <UpdateAffiliate
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        poolAddr={poolAddr}
        setUpdate={setUpdate}
        update={update}
      />
      <StartEndTimeSetting
        open={opensed}
        handleClose={() => setOpensed(false)}
        poolAddr={poolAddr}
        setUpdate={setUpdate}
        update={update}
      />
    </Box>
  );
};

export default OwnerZone;
