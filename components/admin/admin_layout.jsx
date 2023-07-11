/** @format */

import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import Drawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import UseMediaQuery from '@/utils/use_media_query';
import HeadElement from '@/pages/_meta_tags';
import { Accordion, AccordionDetails, AccordionSummary, Tooltip, Typography } from '@mui/material';
import admin_comp_styles from './admin_components.module.css';
import FlutterDashIcon from '@mui/icons-material/FlutterDash';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import EngineeringOutlinedIcon from '@mui/icons-material/EngineeringOutlined';
import PersonSearchOutlinedIcon from '@mui/icons-material/PersonSearchOutlined';
import InventoryTwoToneIcon from '@mui/icons-material/InventoryTwoTone';
import { MEMBER_ROLES, ADMIN_PANEL_ACTIONS, APP_ROUTES, SITE_DATA } from '@/config';
import CottageTwoToneIcon from '@mui/icons-material/CottageTwoTone';
import PermContactCalendarTwoToneIcon from '@mui/icons-material/PermContactCalendarTwoTone';
import AdminPanelSettingsTwoToneIcon from '@mui/icons-material/AdminPanelSettingsTwoTone';
import Diversity3TwoToneIcon from '@mui/icons-material/Diversity3TwoTone';
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';
import EventNoteTwoToneIcon from '@mui/icons-material/EventNoteTwoTone';
import SettingsSuggestTwoToneIcon from '@mui/icons-material/SettingsSuggestTwoTone';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import Link from 'next/link';
import Button from '@mui/material/Button';
import { useRouter } from 'next/router';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useAppContext } from '@/context';
import { ToggleFullScreen } from '@/utils/toggle_full_screen';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Logout from '@mui/icons-material/Logout';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/actions/auth_action';
import { CreateAdminModal } from '..';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import WebStoriesIcon from '@mui/icons-material/WebStories';
import BookOutlinedIcon from '@mui/icons-material/BookOutlined';
import TagOutlinedIcon from '@mui/icons-material/TagOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import ContactMailSharpIcon from '@mui/icons-material/ContactMailSharp';
import AttachEmailSharpIcon from '@mui/icons-material/AttachEmailSharp';
import SendSharpIcon from '@mui/icons-material/SendSharp';

const AdminDashboardNavItems1 = [
	{ name: 'Dashboard', icon: <FlutterDashIcon className={admin_comp_styles.nav_icon} />, href: APP_ROUTES.ADMIN_DASHBOARD, id: 'dashboardlink' },
	{
		name: 'My Profile',
		icon: <AccountCircleOutlinedIcon className={admin_comp_styles.nav_icon} />,
		href: APP_ROUTES.ADMIN_PROFILE,
		id: 'accountsettingslink',
	},

	{
		name: 'Customize Pages',
		icon: <SettingsSuggestTwoToneIcon className={admin_comp_styles.nav_icon} />,
		href: '/#',
		id: 'customizepageslink',
		children: [
			{
				name: 'Home',
				icon: <CottageTwoToneIcon className={admin_comp_styles.nav_icon} />,
				href: `${APP_ROUTES.PAGES_CUSTOMIZATION}/home`,
				id: 'homepage',
			},
			{
				name: 'About Us',
				icon: <PersonSearchOutlinedIcon className={admin_comp_styles.nav_icon} />,
				href: `${APP_ROUTES.PAGES_CUSTOMIZATION}/about-us`,
				id: 'aboutuspage',
			},
			{
				name: 'Contact Us',
				icon: <PermContactCalendarTwoToneIcon className={admin_comp_styles.nav_icon} />,
				href: `${APP_ROUTES.PAGES_CUSTOMIZATION}/contact-us`,
				id: 'contactuspage',
			},
		],
	},
	{
		name: 'Articles & Blogs',
		icon: <BookOutlinedIcon className={admin_comp_styles.nav_icon} />,
		href: '/#',
		id: 'blogsectionlink',
		children: [
			{
				name: 'Tags',
				icon: <TagOutlinedIcon className={admin_comp_styles.nav_icon} />,
				href: `${APP_ROUTES.MANAGE_BLOG_TAGS}`,
				id: 'tags',
			},
			{
				name: 'Categories',
				icon: <CategoryOutlinedIcon className={admin_comp_styles.nav_icon} />,
				href: `${APP_ROUTES.MANAGE_BLOG_CATEGORIES}`,
				id: 'categories',
			},
			{
				name: 'Manage Articles & Blog',
				icon: <MenuBookOutlinedIcon className={admin_comp_styles.nav_icon} />,
				href: `${APP_ROUTES.MANAGE_BLOGS}`,
				id: 'blogsmanagae',
			},
			{
				name: 'Manage Authors',
				icon: <AccountCircleOutlinedIcon className={admin_comp_styles.nav_icon} />,
				href: APP_ROUTES.MANAGE_BLOG_AUTHORS,
				id: 'manageauthors',
			},
			{
				name: 'Articles & Blog Settings',
				icon: <SettingsTwoToneIcon className={admin_comp_styles.nav_icon} />,
				href: `${APP_ROUTES.MANAGE_BLOGS_SETTINGS}`,
				id: 'blogsmanagae',
			},
		],
	},
	{
		name: 'Upcoming Events',
		icon: <EventNoteTwoToneIcon className={admin_comp_styles.nav_icon} />,
		href: APP_ROUTES.MANAGE_UPCOMING_EVENTS,
		id: 'upcomingevents',
	},
	{
		name: 'Contact Form',
		icon: <PermContactCalendarTwoToneIcon className={admin_comp_styles.nav_icon} />,
		href: APP_ROUTES.CONTACT_FORM_SUBMISSIONS,
		id: 'contactformslink',
	},
];

const AdminDashboardNavItems2 = [
	{
		name: 'Manage Admins',
		icon: <AdminPanelSettingsTwoToneIcon className={admin_comp_styles.nav_icon} />,
		href: APP_ROUTES.MANAGE_ADMINS,
		id: 'adminssettingslink',
	},
	{
		name: 'Site Settings',
		icon: <SettingsTwoToneIcon className={admin_comp_styles.nav_icon} />,
		href: APP_ROUTES.SITE_SETTINGS,
		id: 'sitesettingslink',
	},
	{ name: 'Activity Logs', icon: <WebStoriesIcon className={admin_comp_styles.nav_icon} />, href: APP_ROUTES.ACTIVITY_LOGS, id: 'activitylog' },
];

const drawerWidth = 270;

const DrawerHeader = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
}));

const openedMixin = (theme) => ({
	width: drawerWidth,
	transition: theme.transitions.create('width', {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.enteringScreen,
	}),
	overflowX: 'hidden',
});

const closedMixin = (theme) => ({
	transition: theme.transitions.create('width', {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	overflowX: 'hidden',
	width: `calc(${theme.spacing(7)} + 1px)`,
	[theme.breakpoints.up('sm')]: {
		width: `calc(${theme.spacing(8)} + 1px)`,
	},
});

const DesktopAppBar = styled(MuiAppBar, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
	zIndex: theme.zIndex.drawer + 1,
	transition: theme.transitions.create(['width', 'margin'], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	...(open && {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	}),
	...(!open && {
		marginLeft: `calc(${theme.spacing(7)} + 1px)`,
		width: `calc(100% - calc(${theme.spacing(8)} + 1px))`,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	}),
}));

const DesktopDrawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
	width: drawerWidth,
	flexShrink: 0,
	whiteSpace: 'nowrap',
	boxSizing: 'border-box',
	'& ::-webkit-scrollbar': {
		background: '#0001',
		width: '4px',
		borderRadius: '100px',
	},
	'& ::-webkit-scrollbar-thumb': {
		background: '#0005',
		borderRadius: '100px',
	},
	'& ::-webkit-scrollbar-thumb:hover': {
		background: '#0008',
	},
	...(open && {
		...openedMixin(theme),
		'& .MuiDrawer-paper': openedMixin(theme),
	}),
	...(!open && {
		...closedMixin(theme),
		'& .MuiDrawer-paper': closedMixin(theme),
	}),
}));

const RenderNavigation = ({ nav, open }) => {
	const router = useRouter();

	return (
		<Tooltip classes={{ tooltip: admin_comp_styles.tooltip }} title={open ? null : nav.name} arrow placement='right'>
			<Link className='text-decor-none' href={nav.href !== undefined ? nav.href : ''} style={{ color: 'inherit' }}>
				<ListItem
					disablePadding
					sx={{
						display: 'block',
						background: router.pathname === nav.href && 'var(--navbar-side-hover-bg)',
						color: router.pathname === nav.href && 'var(--navbar-side-hover-color)',
						fontSize: '17px',
					}}>
					<ListItemButton sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5 }}>
						<ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}>{nav.icon}</ListItemIcon>
						<ListItemText primary={nav.name} sx={{ opacity: open ? 1 : 0 }} />
					</ListItemButton>
				</ListItem>
			</Link>
		</Tooltip>
	);
};

const RenderDropdownNav = ({ nav, open }) => {
	const router = useRouter();

	return (
		<div className='w-full'>
			<Accordion disableGutters elevation={0} expanded={nav.children.find((index) => index.href === router.pathname) && true}>
				<Tooltip classes={{ tooltip: admin_comp_styles.tooltip }} title={open ? null : nav.name} arrow placement='right'>
					<AccordionSummary
						sx={{
							padding: '0px auto',
							display: 'flex',
							background: nav.children.find((index) => index.href === router.pathname) && 'var(--navbar-side-hover-bg)',
							color: router.pathname === nav.href && 'var(--navbar-side-hover-color)',
						}}
						expandIcon={<ExpandMoreIcon />}>
						<Box sx={{ minWidth: 0, ml: 0.5, mr: open ? 3 : 'auto', justifyContent: 'center' }}>{nav.icon}</Box>
						<Box sx={{ opacity: open ? 1 : 0, width: open ? 'auto' : 0, fontSize: '16px' }}>{nav.name}</Box>
					</AccordionSummary>
				</Tooltip>
				<AccordionDetails sx={{ padding: '0 0', width: '100%' }}>
					{nav.children.map((child, index) => (
						<RenderNavigation nav={child} open={open} key={index} />
					))}
				</AccordionDetails>
			</Accordion>
		</div>
	);
};

const DrawerContent = ({ open }) => {
	const { auth } = useSelector((state) => state);
	return (
		<React.Fragment>
			<DrawerHeader
				className={`color-primary border prevent-select`}
				sx={{
					width: open ? drawerWidth : '65px',
					fontSize: '19px',
					fontWeight: '600',
					textShadow: '0 0 5px rgb(133 61 209 / 10%)',
					position: 'fixed',
					top: 0,
					left: 0,
					background: '#fff',
					zIndex: 2000,
					flexFlow: 'column',
					height: '70px',
					marginTop: { xs: -0.5, md: 0 },
					padding: 0,
				}}>
				<div className='shadow w-full flex p-2'>
					<Avatar src={auth?.user?.avatar} alt={auth?.user?.firstname} className={`${!open && 'mx-auto'} my-auto shadow`} />
					<div className={`my-auto ml-2 ${!open && 'hidden'}`}>
						<div className='font-medium-custom text-[15px] line-height-1 text-dark w-full text-center'>{`${
							auth?.user?.lastname ? auth?.user?.lastname : ''
						} ${auth?.user?.firstname ? auth?.user?.firstname : ''} ${auth?.user?.secondname ? auth?.user?.secondname : ''}`}</div>
						<div className='font-medium-custom text-[14px] color-primary w-full mt-1'>
							{auth?.user?.member_role === MEMBER_ROLES.MASTER && 'Master Admin'}
							{auth?.user?.member_role === MEMBER_ROLES.MANAGER && 'Manager Admin'}
						</div>
					</div>
				</div>
			</DrawerHeader>
			<List className='w-full pt-5 mt-[50px]'>
				{AdminDashboardNavItems1.map((nav, index) => (
					<React.Fragment key={index}>
						{nav.children && <RenderDropdownNav nav={nav} open={open} />}
						{!nav.children && <RenderNavigation nav={nav} open={open} />}
					</React.Fragment>
				))}
			</List>
			<Divider />
			<List>
				{auth?.user?.member_role === MEMBER_ROLES.MASTER &&
					AdminDashboardNavItems2.map((nav, index) => (
						<React.Fragment key={index}>
							{nav.children && <RenderDropdownNav nav={nav} open={open} />}
							{!nav.children && <RenderNavigation nav={nav} open={open} />}
						</React.Fragment>
					))}
			</List>
			{auth?.user?.member_role === MEMBER_ROLES.MASTER && <Divider />}
			<Box sx={{ width: '100%', p: 2 }}>
				<Link className='text-decor-none' target='_blank' href={APP_ROUTES.HOME} style={{ color: 'inherit' }}>
					{open && (
						<Button
							style={{ width: '100%', background: SITE_DATA.THEME_COLOR }}
							className='text-decor-none btn-animated'
							variant='contained'>
							Visit Website
						</Button>
					)}
					{!open && (
						<Tooltip classes={{ tooltip: admin_comp_styles.tooltip }} title={open ? null : 'Visit Website'} arrow placement='right'>
							<CottageTwoToneIcon className={admin_comp_styles.nav_icon} />
						</Tooltip>
					)}
				</Link>
			</Box>
		</React.Fragment>
	);
};

const UserMenu = () => {
	const { auth } = useSelector((state) => state);
	const dispatch = useDispatch();
	const router = useRouter();
	// ** AVATAR DROPDOWN MENU
	const [anchorEl, setAnchorEl] = React.useState(null);
	const handleCloseMenu = () => setAnchorEl(null);
	const menuOpen = Boolean(anchorEl);
	const handleClickMenu = (event) => setAnchorEl(event.currentTarget);

	// ** CREATE ADMIN MODAL
	const [openCreateAdminModal, setOpenCreateAdminModal] = React.useState(null);
	const handleCreateAdmin = () => {
		handleCloseMenu();
		setOpenCreateAdminModal(true);
	};

	// ** LOGOUT USER
	const handleLogOut = () => {
		dispatch(logout({}));
		handleCloseMenu();
	};
	return (
		<React.Fragment>
			<Tooltip classes={{ tooltip: admin_comp_styles.tooltip }} title='Account settings' arrow placement='bottom'>
				<IconButton
					onClick={handleClickMenu}
					size='small'
					sx={{ ml: 2 }}
					aria-controls={menuOpen ? 'account-menu' : undefined}
					aria-haspopup='true'
					aria-expanded={menuOpen ? 'true' : undefined}>
					<Avatar sx={{ width: 32, height: 32, border: '1px solid #eee' }} src={auth?.user?.avatar} />
				</IconButton>
			</Tooltip>
			<Menu
				anchorEl={anchorEl}
				id='account-menu'
				open={menuOpen}
				onClose={handleCloseMenu}
				onClick={handleCloseMenu}
				PaperProps={{
					elevation: 0,
					sx: {
						overflow: 'visible',
						filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
						mt: 1.5,
						'& .MuiAvatar-root': {
							width: 32,
							height: 32,
							ml: -0.5,
							mr: 1,
						},
						'&:before': {
							content: '""',
							display: 'block',
							position: 'absolute',
							top: 0,
							right: 14,
							width: 10,
							height: 10,
							bgcolor: 'background.paper',
							transform: 'translateY(-50%) rotate(45deg)',
							zIndex: 0,
						},
					},
				}}
				transformOrigin={{ horizontal: 'right', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
				<Link className='text-decor-none text-black w-full' href={APP_ROUTES.ADMIN_PROFILE}>
					<MenuItem onClick={handleCloseMenu}>
						<Avatar src={auth?.user?.avatar} /> My Profile
					</MenuItem>
				</Link>
				<Divider />
				{router.pathname !== APP_ROUTES.MANAGE_ADMINS &&
					auth?.user?.member_role === MEMBER_ROLES.MASTER &&
					!auth?.user?.restrictions?.includes(ADMIN_PANEL_ACTIONS.CREATE_ADMIN) && (
						<MenuItem onClick={handleCreateAdmin}>
							<ListItemIcon>
								<PersonAdd fontSize='small' />
							</ListItemIcon>
							Create New Admin
						</MenuItem>
					)}
				<MenuItem onClick={handleLogOut}>
					<ListItemIcon>
						<Logout fontSize='small' />
					</ListItemIcon>
					Logout
				</MenuItem>
			</Menu>
			{router.pathname !== APP_ROUTES.MANAGE_ADMINS && (
				<CreateAdminModal openModal={openCreateAdminModal} setOpenModal={setOpenCreateAdminModal} />
			)}
		</React.Fragment>
	);
};

const RenderChildTopLayout = ({ pageIcon, pageTitle }) => {
	return (
		<React.Fragment>
			<Typography
				sx={{ fontWeight: '700', mt: 2, mb: 3, fontSize: { xs: '20px', sm: '22px', md: '30px' }, alignItems: 'center', display: 'flex' }}
				className='color-primary'>
				{pageIcon} {pageTitle}
			</Typography>
			<Divider className='mb-4' />
		</React.Fragment>
	);
};

const RenderFooter = () => {
	return (
		<Box className='text-center w-full fs-8 text-secondary'>
			<Divider className='bg-primary w-full mb-2' />
			&copy; Advanced Admin Panel Built By - {SITE_DATA.DEVELOPER_NAME}
			<Link href={SITE_DATA.DEVELOPER_URL} target='_blank' className='ml-1 color-primary text-decor-none font-semibold'>
				Contact Developer
			</Link>
		</Box>
	);
};

const DesktopLayout = ({ children, pageIcon, pageTitle }) => {
	const theme = useTheme();
	const { isSideNavExpand, setIsSideNavExpand, isFullScreen, setIsFullScreen } = useAppContext();

	const handleToggleopen = () => setIsSideNavExpand(!isSideNavExpand);
	const handleFullScreen = () => {
		ToggleFullScreen({ element: document.documentElement });
		setIsFullScreen(!isFullScreen);
	};

	return (
		<Box sx={{ display: 'flex', width: '100%', height: '100%', paddingRight: '5px' }}>
			<DesktopAppBar position='fixed' open={isSideNavExpand} color='white'>
				<Toolbar sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
					<Box>
						<IconButton color='inherit' onClick={handleToggleopen} edge='start' sx={{ mr: 5 }}>
							{!isSideNavExpand ? (
								<MenuIcon sx={{ fontSize: '25px', color: '#0009' }} />
							) : (
								<ChevronLeftIcon sx={{ fontSize: '25px', color: '#0009' }} />
							)}
						</IconButton>
						<IconButton color='inherit' onClick={handleFullScreen} edge='start' sx={{ mr: 5 }}>
							{isFullScreen ? (
								<FullscreenExitIcon sx={{ fontSize: '25px', color: '#0009' }} />
							) : (
								<FullscreenIcon sx={{ fontSize: '25px', color: '#0009' }} />
							)}
						</IconButton>
					</Box>

					<UserMenu />
				</Toolbar>
			</DesktopAppBar>
			<DesktopDrawer variant='permanent' open={isSideNavExpand} children={<DrawerContent open={isSideNavExpand} />} />
			<Box component='main' sx={{ flexGrow: 1, p: 2, width: '100%', height: '100%', position: 'relative' }}>
				<DrawerHeader />
				<RenderChildTopLayout pageIcon={pageIcon} pageTitle={pageTitle} />
				<Box sx={{ display: 'flex', flexFlow: 'column', minHeight: '100vh', justifyContent: 'space-between' }}>
					<div className='w-full h-full'>{children}</div>
					<RenderFooter />
				</Box>
			</Box>
		</Box>
	);
};

const ResponsiveLayout = ({ children, pageIcon, pageTitle }) => {
	const [open, setOpen] = React.useState(false);
	const handleDrawerToggle = () => setOpen(!open);

	return (
		<Box sx={{ display: 'flex', width: '100%', height: '100%' }}>
			<AppBar position='fixed' color='white'>
				<Toolbar sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
					<Box>
						<IconButton color='inherit' aria-label='open drawer' edge='start' onClick={handleDrawerToggle}>
							<MenuIcon />
						</IconButton>
					</Box>

					<UserMenu />
				</Toolbar>
			</AppBar>
			<Drawer
				container={document.body}
				variant='temporary'
				open={open}
				onClose={handleDrawerToggle}
				ModalProps={{
					keepMounted: true, // Better open performance on mobile.
				}}
				sx={{
					height: '100%',
					display: { xs: 'block', sm: 'none' },
					'& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, height: '100%' },
				}}
				children={<DrawerContent open={open} />}
			/>
			<Box component='main' sx={{ flexGrow: 1, p: 1, width: '100%', height: '100%', position: 'relative' }}>
				<Toolbar />
				<RenderChildTopLayout pageIcon={pageIcon} pageTitle={pageTitle} />
				<Box sx={{ display: 'flex', flexFlow: 'column', minHeight: '100vh', justifyContent: 'space-between' }}>
					{children}
					<RenderFooter />
				</Box>
			</Box>
		</Box>
	);
};

const AdminLayout = ({ children, metatags, pageIcon, pageTitle }) => {
	const { isMatchWidth } = UseMediaQuery({ vw: '768px' });
	const { isBreakpointMd, setIsBreakpointMd } = useAppContext();

	React.useEffect(() => {
		document.querySelector(':root').style.setProperty('--app-bg', '#f5f5f5');

		if (isMatchWidth !== undefined) setIsBreakpointMd(isMatchWidth);

		return () => document.querySelector(':root').style.setProperty('--app-bg', '#fff');
	}, [isMatchWidth]);

	return (
		<React.Fragment>
			<HeadElement metatags={metatags} />
			{isBreakpointMd !== undefined && !isBreakpointMd && <DesktopLayout children={children} pageIcon={pageIcon} pageTitle={pageTitle} />}
			{isBreakpointMd !== undefined && isBreakpointMd && <ResponsiveLayout children={children} pageIcon={pageIcon} pageTitle={pageTitle} />}
		</React.Fragment>
	);
};

export default AdminLayout;
