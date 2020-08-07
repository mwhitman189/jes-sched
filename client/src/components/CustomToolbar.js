// import React, { useContext, useState, useEffect } from "react";
// import moment from "moment";
// import { TeachersContext } from "../context/TeachersContext";
// import { UserContext } from "../context/UserContext";
// import styled from "styled-components";
// import { withStyles } from "@material-ui/core/styles";
// import IconButton from "@material-ui/core/IconButton";
// import RightArrowIcon from "@material-ui/icons/ChevronRight";
// import LeftArrowIcon from "@material-ui/icons/ChevronLeft";
// import Button from "@material-ui/core/Button";
// import Menu from "@material-ui/core/Menu";
// import MenuItem from "@material-ui/core/MenuItem";
// import ListItemIcon from "@material-ui/core/ListItemIcon";
// import ListItemText from "@material-ui/core/ListItemText";
// import ExitToAppIcon from "@material-ui/icons/ExitToApp";
// import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
// import PersonAddIcon from "@material-ui/icons/PersonAdd";
// import Avatar from "@material-ui/core/Avatar";
// import List from "@material-ui/core/List";
// import ListItem from "@material-ui/core/ListItem";
// import ListItemAvatar from "@material-ui/core/ListItemAvatar";
// import Dialog from "@material-ui/core/Dialog";
// import PersonIcon from "@material-ui/icons/Person";
// import DialogTitle from "@material-ui/core/DialogTitle";
// import styles from "../styles/CustomToolbarStyles";
// import "react-big-calendar/lib/sass/toolbar.scss";

// // const TeacherList = styled.ul`
// //   font-size: 1rem;
// //   display: flex;
// //   justify-content: space-around;
// //   list-style: none;
// //   font-weight: 600;
// //   width: 33%;
// //   "& li": {
// //     font-size: 85%
// //     padding: 0 .6rem
// //   };
// //   [theme.breakpoints.down("sm")]: {
// //     font-size: .7rem
// //   };
// // `;

// // const Resource = styled.li`
// //   color: ${(props) =>
// //     props.resource.isPartTime
// //       ? "#ca02e0"
// //       : props.resource.overThresholdTwoMins > 0
// //       ? "#e00262"
// //       : props.resource.overThresholdOneMins > 0
// //       ? "#ca02e0"
// //       : "#0220e0"};
// // `;

// // // Debounce to prevent re-renders on every dimension change
// // function debounce(fn, ms) {
// //   let timer;
// //   return (_) => {
// //     clearTimeout(timer);
// //     timer = setTimeout((_) => {
// //       timer = null;
// //       fn.apply(this, arguments);
// //     }, ms);
// //   };
// // }

// // function calcMinsToHours(mins) {
// //   return Math.round((mins / 60 + Number.EPSILON) * 100) / 100;
// // }

// const CustomToolbar = (props) => {
//   // const {
//   //   classes,
//   //   onNavigate,
//   //   onView,
//   //   isRTL,
//   //   date,
//   //   handleAddTeacherNav,
//   //   handlePayrollNav,
//   //   handleAddStaffNav,
//   //   handleAddStudentNav,
//   // } = props;
//   // const { teachers } = useContext(TeachersContext);
//   // const { user, dispatch } = useContext(UserContext);
//   // const [anchorEl, setAnchorEl] = useState(null);
//   // const [stage, setStage] = useState("");
//   // const [dimensions, setDimensions] = useState({
//   //   width: window.innerWidth,
//   // });

//   // Set the types of items to display in the "Create new..." dialog
//   const ITEM_TYPES = [
//     {
//       itemType: "teacher",
//       title: "Add new teacher",
//       onClickEvent: handleAddTeacherNav,
//     },
//     {
//       itemType: "staff",
//       title: "Add new staff",
//       onClickEvent: handleAddStaffNav,
//     },
//     {
//       itemType: "student",
//       title: "Add new student",
//       onClickEvent: () => {
//         handleAddStudentNav();
//         setStage("");
//       },
//     },
//   ];

//   // // Set the width state to the current window width
//   // useEffect(() => {
//   //   const debouncedHandleResize = debounce(function handleResize() {
//   //     setDimensions({
//   //       width: window.innerWidth,
//   //     });
//   //   }, 1000);

//   //   window.addEventListener("resize", debouncedHandleResize);

//   //   return (_) => {
//   //     window.removeEventListener("resize", debouncedHandleResize);
//   //   };
//   // });

//   // const TeacherList = () => {
//   //   return (
//   //     <TeacherList>
//   //       {
//   //         // If teacher is defined because user is a teacher, list user's teaching mins.
//   //         // Otherwise, list all teachers' teaching mins
//   //         teacher ? (
//   //           <Resource
//   //             resource={teacher}
//   //           >{`${teacher.name}: ${teacher.teachingMins}`}</Resource>
//   //         ) : (
//   //           teachers &&
//   //           teachers.map((t) => {
//   //             const teachingHours = calcMinsToHours(t.teachingMins);
//   //             return (
//   //               <Resource key={`toolbar-teacher1-${t.resourceId}`} resource={t}>
//   //                 <div>{t.name}</div>
//   //                 <div>{teachingHours}</div>
//   //               </Resource>
//   //             );
//   //           })
//   //         )
//   //       }
//   //     </TeacherList>
//   //   );
//   // };

//   // const handleClick = (event) => {
//   //   setAnchorEl(event.currentTarget);
//   // };

//   // const handleClose = () => {
//   //   setAnchorEl(null);
//   // };

//   // const handleAddNewNav = () => {
//   //   setStage("addNewPerson");
//   // };

//   // const handleCloseAddNew = () => {
//   //   setStage("");
//   // };

//   // // Search for user in teachers. If user is teacher, return teacher object
//   // // for use in conditional rendering of teaching minutes
//   // const teacher =
//   //   user.user.role === "teacher" &&
//   //   teachers.find((t) => t.email === user.user.email);

//   // const handleLogout = (e) => {
//   //   e.preventDefault();
//   //   dispatch({ type: "LOGOUT_SUCCESS" });
//   // };

//   const StyledMenu = withStyles({
//     paper: {
//       border: "1px solid #d3d4d5",
//     },
//   })((props) => (
//     <Menu
//       elevation={0}
//       getContentAnchorEl={null}
//       anchorOrigin={{
//         vertical: "bottom",
//         horizontal: "center",
//       }}
//       transformOrigin={{
//         vertical: "top",
//         horizontal: "center",
//       }}
//       {...props}
//     />
//   ));

//   const StyledMenuItem = withStyles((theme) => ({
//     root: {
//       "&:focus": {
//         backgroundColor: theme.palette.primary.main,
//         "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
//           color: theme.palette.common.white,
//         },
//       },
//     },
//   }))(MenuItem);

//   const collapseToolbar = (
//     <div className={classes.toolbar}>
//       <Dialog
//         aria-labelledby="add-new-item-select"
//         open={stage === "addNewPerson"}
//         onClose={handleCloseAddNew}
//       >
//         <DialogTitle id="add-new-item-select">Add New...</DialogTitle>
//         <List>
//           {ITEM_TYPES.map((t) => (
//             <ListItem
//               button
//               onClick={t.onClickEvent}
//               key={`itemType-${t.itemType}`}
//             >
//               <ListItemAvatar>
//                 <Avatar className={classes.avatar}>
//                   <PersonIcon />
//                 </Avatar>
//               </ListItemAvatar>
//               <ListItemText primary={t.title} />
//             </ListItem>
//           ))}
//         </List>
//       </Dialog>
//       <div></div>
//       <TeacherList />
//       <Button
//         aria-controls="customized-menu"
//         aria-haspopup="true"
//         variant="contained"
//         color="primary"
//         onClick={handleClick}
//       >
//         Menu
//       </Button>
//       <StyledMenu
//         id="customized-menu"
//         anchorEl={anchorEl}
//         keepMounted
//         open={Boolean(anchorEl)}
//         onClose={handleClose}
//       >
//         <div style={{ display: "flex" }}>
//           <StyledMenuItem
//             className={classes.navBtnNav}
//             type="button"
//             onClick={() => onNavigate("PREV")}
//           >
//             <ListItemIcon style={{ minWidth: 0 }}>
//               <LeftArrowIcon fontSize="small" />
//             </ListItemIcon>
//           </StyledMenuItem>
//           <StyledMenuItem
//             className={classes.navBtnNav}
//             type="button"
//             onClick={() => onNavigate("NEXT")}
//           >
//             <ListItemIcon style={{ minWidth: 0 }}>
//               <RightArrowIcon fontSize="small" />
//             </ListItemIcon>
//           </StyledMenuItem>
//           <StyledMenuItem
//             className={classes.navBtnNav}
//             type="button"
//             onClick={() => onView("week")}
//           >
//             <ListItemIcon style={{ minWidth: 0 }}>Week</ListItemIcon>
//           </StyledMenuItem>
//         </div>

//         {user.user.role !== "teacher" && (
//           <>
//             <StyledMenuItem
//               className={classes.navBtn}
//               onClick={handleAddNewNav}
//             >
//               <ListItemIcon>
//                 <PersonAddIcon className={classes.icon} fontSize="small" />
//               </ListItemIcon>
//               <ListItemText primary="Add New..." />
//             </StyledMenuItem>
//             <StyledMenuItem
//               className={classes.navBtn}
//               onClick={handlePayrollNav}
//             >
//               <ListItemIcon>
//                 <AttachMoneyIcon fontSize="small" />
//               </ListItemIcon>
//               <ListItemText primary="Payroll" />
//             </StyledMenuItem>
//           </>
//         )}
//         <StyledMenuItem
//           style={{
//             background: "#f50057",
//             background:
//               "linear-gradient(0deg, rgba(186, 4, 68,1) 7%, rgba(245, 0, 86,1) 100%)",
//           }}
//           className={classes.navBtn}
//           onClick={handleLogout}
//         >
//           <ListItemIcon>
//             <ExitToAppIcon fontSize="small" />
//           </ListItemIcon>
//           <ListItemText primary="Logout" />
//         </StyledMenuItem>
//       </StyledMenu>
//     </div>
//   );

//   const fullSizeToolbar = (
//     <div className={classes.toolbar}>
//       <Dialog
//         aria-labelledby="add-new-item-select"
//         open={stage === "addNewPerson"}
//         onClose={handleCloseAddNew}
//       >
//         <DialogTitle id="add-new-item-select">Add New...</DialogTitle>
//         <List>
//           {ITEM_TYPES.map((t) => (
//             <ListItem
//               button
//               onClick={t.onClickEvent}
//               key={`toolbar-type-${t.itemType}`}
//             >
//               <ListItemAvatar>
//                 <Avatar className={classes.avatar}>
//                   <PersonIcon />
//                 </Avatar>
//               </ListItemAvatar>
//               <ListItemText primary={t.title} />
//             </ListItem>
//           ))}
//         </List>
//       </Dialog>
//       <div className={classes.btnGroup}>
//         <IconButton
//           className={classes.navBtn}
//           type="button"
//           onClick={() => onNavigate("PREV")}
//         >
//           <LeftArrowIcon
//             className={classes.navIcon}
//             icon={isRTL ? "chevron-right" : "chevron-left"}
//           />
//         </IconButton>
//         <span
//           className={classes.todayLabel}
//           onClick={() => onNavigate("TODAY")}
//         >
//           {moment(date).format("MM/DD").toLocaleString()}
//         </span>
//         <IconButton
//           className={classes.navBtn}
//           type="button"
//           onClick={() => onNavigate("NEXT")}
//         >
//           <RightArrowIcon
//             className={classes.navIcon}
//             icon={isRTL ? "chevron-left" : "chevron-right"}
//           />
//         </IconButton>
//         <IconButton
//           className={classes.navBtn}
//           type="button"
//           onClick={() => onView("week")}
//         >
//           Week
//         </IconButton>
//       </div>

//       <TeacherList />

//       <div className={classes.btnGroup}>
//         {user.user.role !== "teacher" && (
//           <>
//             <button className={classes.navBtn} onClick={handleAddNewNav}>
//               <PersonAddIcon className={classes.icon} fontSize="small" />
//               Add New...
//             </button>
//             <button className={classes.navBtn} onClick={handlePayrollNav}>
//               <AttachMoneyIcon className={classes.icon} fontSize="small" />
//               Payroll
//             </button>
//           </>
//         )}

//         <button
//           style={{
//             background: "#f50057",
//             background:
//               "linear-gradient(0deg, rgba(186, 4, 68,1) 7%, rgba(245, 0, 86,1) 100%)",
//           }}
//           className={classes.navBtn}
//           onClick={handleLogout}
//         >
//           <ExitToAppIcon className={classes.icon} fontSize="small" />
//           Logout
//         </button>
//       </div>
//     </div>
//   );

//   return dimensions.width < 750 ? collapseToolbar : fullSizeToolbar;
// };

// export default withStyles(styles)(CustomToolbar);
