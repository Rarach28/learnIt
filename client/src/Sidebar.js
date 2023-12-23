import {
  Outlet,
  Link,
  Form,
  redirect,
  NavLink,
  useSubmit,
  useLoaderData,
  useMatch,
  useResolvedPath,
} from "react-router-dom";
import { useEffect } from "react";
// import { userMiddleware } from "../../middleware/User";

import { IoIosStats } from "react-icons/io";
import {
  FaDatabase,
  FaServer,
  FaCodeBranch,
  FaHubspot,
  FaUsers,
  FaBoxArchive,
  FaUserLarge,
  FaPowerOff,
} from "react-icons/fa6";
import { MdMonitor } from "react-icons/md";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { ImBooks } from "react-icons/im";
import { BiSolidDashboard } from "react-icons/bi";

// export async function loader({ request }) {
//   const url = new URL(request.url);

//   return { sbItems, sbItemsBottom };
// }
function loadSbItems() {
  const sbItems = {
    // Dashboard: {
    //   icon: <BiSolidDashboard />,
    //   to: "/",
    // },
    Sets: {
      icon: <ImBooks />,
      to: "/sets",
    },
    // Statistics: {
    //   icon: <IoIosStats />,
    //   to: "/statistics",
    // },
    // Logs: {
    //   icon: <FaBoxArchive />,
    //   nested: {
    //     "Audit Log": "log-audit",
    //   },
    // },
  };

  const sbItemsBottom = {
    Profile: {
      icon: <FaUserLarge />,
      to: "/profile",
    },
    Logout: {
      icon: <FaPowerOff className="text-red-500" />,
      to: "/logout",
    },
  };

  return { sbItems, sbItemsBottom };
}

const Sidebar = ({ username, Logout }) => {
  //   const navigation = useNavigation();
  const { sbItems, sbItemsBottom } = loadSbItems();

  const SideBarItem = ({ icon, children, to = "#", nested = [] }) => {
    const fullCurrentPath = useResolvedPath(to);
    // const nestedValues = Object.values(nested); // Extract the values from the nested object

    const paths = fullCurrentPath.pathname;

    const isActive = useMatch({
      path: paths,
      children: true,
      end: true, // Ensure that the match is exact
    });

    // const fullCurrentPath = useResolvedPath(to);
    // const nestedValues = [];
    // for (const key in nested) {
    //   if (nested.hasOwnProperty(key) && typeof nested[key] === "string") {
    //     nestedValues.push(nested[key]);
    //   }
    // }

    // const paths = [fullCurrentPath.pathname, ...nestedValues].join("|");

    // console.log("Paths:", paths);

    // const isActive = useMatch({
    //   path: paths,
    //   children: true,
    // });

    // const isActive = useMatch({ path: fullCurentPath.pathname, end: true }); //diky end: true se matchuje cela cesta a ne jen segment
    const sidebarTooltipItemClasses =
      "sidebar-tooltip group-hover:scale-100 bg-secondary z-[900000]";
    if (nested.length == 0) {
      //pokud nema potomky tak vykresli link
      return (
        <Link
          className={
            "sidebar-item group hover:bg-secondary relative" +
            (isActive ? " active bg-primary" : "")
          }
          to={to}
        >
          {icon}
          <div className={sidebarTooltipItemClasses}>
            <div className="text-[1.1rem] text-center">{children}</div>
          </div>
        </Link>
      );
    } else {
      //pokud ma potomky tak vykresli div a potomky<
      return (
        <div
          className={
            "sidebar-item group hover:bg-secondary peer" +
            (!isActive ? " active bg-primary" : "")
          }
        >
          {icon}
          <div className={sidebarTooltipItemClasses}>
            <div className="text-[1.1rem] text-center">{children}</div>

            <ul className={Object.keys(nested).length > 0 ? "mt-2" : ""}>
              {Object.keys(nested).map((item) => (
                <li
                  className={
                    "sidebar-tooltipItem hover:bg-primary " +
                    ("/" + nested[item] == window.location.pathname
                      ? " active bg-primary"
                      : "")
                  }
                  key={nested[item]}
                >
                  <Link
                    to={nested[item]}
                    className={"flex justify-between w-full h-full p-2 "}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="top-0 left-0 h-screen w-16 m-0 flex flex-col shadow-lg justify-between pb-2 border-r-2">
      <div>
        {Object.keys(sbItems).map((name) => (
          <SideBarItem key={name} {...sbItems[name]}>
            {name}
          </SideBarItem>
        ))}
      </div>
      <div>
        {Object.keys(sbItemsBottom).map((name) => (
          <SideBarItem key={name} {...sbItemsBottom[name]}>
            {name}
          </SideBarItem>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
