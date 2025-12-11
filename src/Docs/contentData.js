export const docsContent = {
  introduction: {
    title: "Introduction",
    content: (
      <>
        <p>
          Welcome to the TrendPad Documentation. TrendPad is a decentralized
          launchpad protocol that allows projects to launch their tokens and
          raise funds in a secure and decentralized manner.
        </p>
        <p>
          Our platform supports multiple blockchains including Ethereum, BSC,
          Polygon, Avalanche, Arbitrum, Optimism, Base, Celo, and Fantom. We
          provide a suite of tools for project owners and investors, ensuring a
          seamless experience for token sales, locking, airdrops, and more.
        </p>
      </>
    ),
  },
  token_metrics: {
    title: "Token Metrics",
    content: (
      <>
        <p>
          Understanding token metrics is crucial for evaluating a project's
          potential. TrendPad provides transparent display of token metrics for
          every launchpad.
        </p>
        <ul>
          <li>
            <strong>Total Supply:</strong> The total amount of tokens created.
          </li>
          <li>
            <strong>Presale Rate:</strong> Number of tokens per 1 ETH/BNB/etc.
            during presale.
          </li>
          <li>
            <strong>Listing Rate:</strong> Number of tokens per 1 ETH/BNB/etc.
            upon listing on DEX.
          </li>
          <li>
            <strong>Initial Market Cap:</strong> Estimated market cap at launch.
          </li>
          <li>
            <strong>Soft Cap:</strong> Minimum funds required for the presale to
            be successful.
          </li>
          <li>
            <strong>Hard Cap:</strong> Maximum funds that can be raised.
          </li>
        </ul>
      </>
    ),
  },
  service_fees: {
    title: "Service Fees",
    content: (
      <>
        <p>
          TrendPad charges a small fee to maintain the platform and ensure
          security. The fees are competitive and transparent.
        </p>
        <h3>Standard Fees</h3>
        <ul>
          <li>
            <strong>Presale Creation Fee:</strong> A small flat fee in native
            currency (e.g., ETH, BNB) + % of raised funds.
          </li>
          <li>
            <strong>Fair Launch Fee:</strong> Similar structure to standard
            presales.
          </li>
          <li>
            <strong>Flat Fee Option:</strong> Some pools may opt for a flat fee
            structure paid upfront.
          </li>
        </ul>
        <p>
          <em>
            Note: Fees may vary by network. Check the specific creation page for
            exact amounts.
          </em>
        </p>
      </>
    ),
  },
  contact_us: {
    title: "Contact Us",
    content: (
      <>
        <p>Have questions or need support? Reach out to our team.</p>
        <p>
          <strong>Email:</strong> support@trendpad.io
          <br />
          <strong>Telegram Support:</strong> @TrendPadSupport
        </p>
      </>
    ),
  },
  social_links: {
    title: "Social Links",
    content: (
      <>
        <p>Stay updated with our latest news and announcements.</p>
        <ul>
          <li>
            <a
              href="https://twitter.com/TrendPad"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter / X
            </a>
          </li>
          <li>
            <a
              href="https://t.me/TrendPad"
              target="_blank"
              rel="noopener noreferrer"
            >
              Telegram Channel
            </a>
          </li>
          <li>
            <a
              href="https://discord.gg/TrendPad"
              target="_blank"
              rel="noopener noreferrer"
            >
              Discord
            </a>
          </li>
          <li>
            <a
              href="https://medium.com/@TrendPad"
              target="_blank"
              rel="noopener noreferrer"
            >
              Medium
            </a>
          </li>
        </ul>
      </>
    ),
  },
  terms_of_service: {
    title: "Terms of Service",
    content: (
      <>
        <p>
          By accessing and using TrendPad, you agree to our Terms of Service.
        </p>
        <p>
          TrendPad is a decentralized protocol. We do not control or endorse any
          specific project launched on our platform. Users must do their own
          research (DYOR) before participating in any presale.
        </p>
        {/* Add full terms here later */}
      </>
    ),
  },
  privacy_policy: {
    title: "Privacy Policy",
    content: (
      <>
        <p>
          Your privacy is important to us. TrendPad does not collect personal
          data such as names, addresses, or phone numbers. We interact only with
          public blockchain addresses.
        </p>
        <p>
          We may strictly use cookies for session management and standard
          analytics to improve user experience.
        </p>
      </>
    ),
  },

  // SERVICES - PRESALE
  create_presale: {
    title: "Create a Presale",
    content: (
      <>
        <p>
          Launching a token sale on TrendPad is straightforward. Follow these
          steps:
        </p>
        <ol>
          <li>
            Navigate to <strong>Launchpad</strong> &gt;{" "}
            <strong>Create Presale</strong>.
          </li>
          <li>
            <strong>Verify Token:</strong> Enter your token address. Note: Your
            token must be approved for the factory contract.
          </li>
          <li>
            <strong>DeFi Launchpad Info:</strong> Set your soft cap, hard cap,
            presale rate, and listing rate. precise calculations are done
            automatically.
          </li>
          <li>
            <strong>Additional Info:</strong> Add your logo, website, social
            links, and project description.
          </li>
          <li>
            <strong>Finish:</strong> Review all details and submit the
            transaction to create your pool.
          </li>
        </ol>
      </>
    ),
  },
  update_presale: {
    title: "Update a Presale",
    content: (
      <>
        <p>
          Project owners can update certain parameters of their presale{" "}
          <em>before it starts</em>.
        </p>
        <ul>
          <li>You can update social links, logos, and descriptions anytime.</li>
          <li>
            Critical financial parameters (caps, rates) usually cannot be
            changed once the pool is created to protect investors.
          </li>
        </ul>
      </>
    ),
  },
  finalize_presale: {
    title: "Finalize a Presale",
    content: (
      <>
        <p>
          Once the presale ends (either by reaching Hard Cap or hitting the End
          Time), the pool must be finalized.
        </p>
        <ol>
          <li>
            Go to your pool's <strong>View</strong> page.
          </li>
          <li>
            Click <strong>Finalize</strong> (only visible to the owner).
          </li>
          <li>
            This action triggers the creation of the liquidity pool on the DEX
            (e.g., Uniswap, PancakeSwap) and locks the liquidity automatically.
          </li>
          <li>
            Unsold tokens are burned or refunded to the creator based on the
            configuration.
          </li>
        </ol>
      </>
    ),
  },
  cancel_presale: {
    title: "Cancel a Presale",
    content: (
      <>
        <p>
          A presale can be cancelled by the owner <em>before it starts</em> or
          if soft cap is not reached by end time.
        </p>
        <p>
          If cancelled, all investors can claim a refund of their contributed
          funds.
        </p>
      </>
    ),
  },
  add_remove_whitelists: {
    title: "Add/Remove Whitelists",
    content: (
      <>
        <p>
          If your presale is set to "Whitelist Only", you can manage the list of
          allowed addresses.
        </p>
        <p>
          In the "Owner Zone" of your pool page, you can paste a list of
          addresses to add or remove them from the whitelist.
        </p>
      </>
    ),
  },
  whitelist_tiers: {
    title: "Whitelist Tiers",
    content: (
      <>
        <p>
          TrendPad supports tiered whitelisting (if enabled). This allows
          different groups of users to buy at different times or with different
          allocations.
        </p>
      </>
    ),
  },
  team_vesting: {
    title: "Team Vesting",
    content: (
      <>
        <p>
          Locking team tokens builds trust. You can use our{" "}
          <strong>TrendLock</strong> service to lock team tokens for a specific
          duration.
        </p>
        <p>Vesting schedules can be linear (drip) or cliff-based.</p>
      </>
    ),
  },
  presale_vesting: {
    title: "Presale Vesting",
    content: (
      <>
        <p>
          You can enable vesting for presale investors to prevent immediate
          dumping at launch.
        </p>
        <p>
          Configure the <strong>First Release for Presale</strong> (e.g., 40% at
          TGE) and the vesting cycle (e.g., 10% every month) during pool
          creation.
        </p>
      </>
    ),
  },

  // SERVICES - FAIR LAUNCH
  create_fair_launch: {
    title: "Create a Fair Launch",
    content: (
      <>
        <p>
          A Fair Launch differs from a standard presale as there is no fixed
          price. The final price is determined by the total amount raised
          divided by the tokens for sale.
        </p>
        <ul>
          <li>
            <strong>Selling Amount:</strong> Total tokens up for sale.
          </li>
          <li>
            <strong>Soft Cap:</strong> Minimum funds required.
          </li>
          <li>
            <strong>No Hard Cap:</strong> (Usually) Users can contribute as much
            as they want.
          </li>
        </ul>
      </>
    ),
  },
  finalize_fair_launch: {
    title: "Finalize a Fair Launch",
    content: (
      <>
        <p>
          Similar to standard presales, finalizing a Fair Launch adds liquidity
          to the DEX. The calculated price is set as the initial listing price.
        </p>
      </>
    ),
  },
  fair_launch_buy_back: {
    title: "Fair Launch Buy-Back Option",
    content: (
      <>
        <p>
          This unique feature allows the protocol to buy back tokens if the
          price drops below a certain threshold, providing a safety net for
          investors.
        </p>
      </>
    ),
  },
};

export const docsNavigation = [
  {
    category: "",
    items: [
      { id: "introduction", label: "Introduction" },
      { id: "token_metrics", label: "Token Metrics" },
      { id: "service_fees", label: "Service Fees" },
    ],
  },
  {
    category: "Important",
    items: [
      { id: "contact_us", label: "Contact Us" },
      { id: "social_links", label: "Social Links" },
      { id: "terms_of_service", label: "Terms of Service" },
      { id: "privacy_policy", label: "Privacy Policy" },
    ],
  },
  {
    category: "SERVICES",
    items: [], // Header only
  },
  {
    category: "PRESALE",
    items: [
      { id: "create_presale", label: "Create a Presale" },
      { id: "update_presale", label: "Update a Presale" },
      { id: "finalize_presale", label: "Finalize a Presale" },
      { id: "cancel_presale", label: "Cancel a Presale" },
      { id: "add_remove_whitelists", label: "Add/Remove Whitelists" },
      { id: "whitelist_tiers", label: "Whitelist Tiers" },
      { id: "team_vesting", label: "Team Vesting" },
      { id: "presale_vesting", label: "Presale Vesting" },
    ],
  },
  {
    category: "FAIR LAUNCH",
    items: [
      { id: "create_fair_launch", label: "Create a Fair Launch" },
      { id: "finalize_fair_launch", label: "Finalize a Fair Launch" },
      { id: "fair_launch_buy_back", label: "Fair Launch Buy-Back Option" },
    ],
  },
];
