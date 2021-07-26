import { useState } from "react";
import { Row, Tag, Typography } from 'antd';
import { FundViewOutlined } from '@ant-design/icons';

import Sidebar from "components/shared/Sidebar";
import { ChainType } from "types/types";
import Step from "components/shared/Step";
import Connect from "./steps/1_Connect";
import Query from "./steps/2_Query";
import Fund from "./steps/3_Fund";
import { PolygonAccountT, PolygonChainIdT } from 'types/polygon-types'
import { getPolygonAddressExplorerURL } from 'utils/polygon-utils'

import { useSteps } from "hooks/steps-hooks";

declare let window: any; // Prevents "Property 'ethereum' does not exist on type 'Window & typeof globalThis'. ts(2339)" linter warning

const { Text, Paragraph } = Typography;

const Chain = ({ chain }: { chain: ChainType }) => {
  const [account, setAccount] = useState<PolygonAccountT>("");

  const { steps } = chain

  const {
    next,
    prev,
    stepIndex,
    step,
    isFirstStep,
    isLastStep
  } = useSteps(steps);

  return (
    <Row>
      <Sidebar
        chain={chain}
        steps={steps}
        stepIndex={stepIndex}
      />
      <Step
        chain={chain}
        step={step}
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
        prev={prev}
        next={next}
        body={
          <>
            {step.id === "connect" && <Connect account={account} setAccount={setAccount} />}
            {step.id === "query" && <Query account={account} />}
            {step.id === "fund" && <Fund account={account} />}
          </>
        }
        nav={<Nav account={account} />}
      />
    </Row>
  );
}

const Nav = ({ account, addressExplorerUrl }: { account: PolygonAccountT, addressExplorerUrl: string}) => {
  // const [addressExplorerUrl, setAddressExplorerUrl] = useState<string>("");

  if (!account) return null;

  if (!addressExplorerUrl) {
    console.log("No explorer URL set in Nav component!")
  }
  const selectedAddress = window.ethereum.selectedAddress;
  const addressToDisplay = `${selectedAddress.slice(0,6)}...${selectedAddress.slice(-4)}`;

  return (
    <div style={{ position: "fixed", top: 20, right: 20 }}>
      <Paragraph copyable={{ text: account, tooltips: `Click to copy!` }}>
        <a href={getPolygonAddressExplorerURL(selectedAddress)} target="_blank" rel="noreferrer"> {/* addressExplorerUrl does not work here ? */}
          <Tag color="gold">
            <FundViewOutlined />{" "} {/* Literal space character used for icon/text spacing because React trims spaces */}
              View {addressToDisplay} on PolygonScan
          </Tag>
        </a>
      </Paragraph>
    </div>
  )
}

export default Chain
