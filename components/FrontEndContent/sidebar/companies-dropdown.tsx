// @ts-nocheck
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@nextui-org/react";
import React, { useState } from "react";
import { AcmeIcon } from "../icons/acme-icon";
import { AcmeLogo } from "../icons/acmelogo";
import { BottomIcon } from "../icons/sidebar/bottom-icon";

interface Company {
  name: string;
  location: string;
  logo: React.ReactNode;
}

export const CompaniesDropdown = () => {
  const [company, setCompany] = useState<Company>({
    name: "R-TTACK",
    location: "Dashboards",
    logo: <AcmeIcon />,
  });
  return (
    <Dropdown
      classNames={{
        base: "w-full min-w-[260px]",
      }}
    >
      <DropdownTrigger className="cursor-pointer">
        <div className="flex items-center gap-2">
          {company.logo}
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-medium m-0 text-default-900 -mb-4 whitespace-nowrap">
              {company.name}
            </h3>
            <span className="text-xs font-medium text-default-500">
              {company.location}
            </span>
          </div>
          <BottomIcon />
        </div>
      </DropdownTrigger>
      <DropdownMenu
        onAction={(e) => {
          if (e === "1") {
            setCompany({
              name: "R-TTACK",
              location: "Dashboards",
              logo: <AcmeIcon />,
            });
          }
          if (e === "2") {
            setCompany({
              name: "R-TTACK",
              location: "R-ttack cli in dev",
              logo: <AcmeLogo />,
            });
          }
        }}
        aria-label="Avatar Actions"
      >
        <DropdownSection title="Companies">
          <DropdownItem
            key="1"
            startContent={<AcmeIcon />}
            description="Dashboards"
            classNames={{
              base: "py-4",
              title: "text-base font-semibold",
            }}
          >
            R-TTACK
          </DropdownItem>

          <DropdownItem
            key="2"
            startContent={<AcmeLogo />}
            description="R-ttack cli in dev"
            classNames={{
              base: "py-4",
              title: "text-base font-semibold",
            }}
          >
            R-TTACK (CLI)
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
};
