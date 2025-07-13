import * as React from "react";
import { signOut, useSession } from "next-auth/react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import AvatarIcon from "@mui/material/Avatar";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { HabitFlowIcon } from "@/components/shared/atoms/CustomIcons";
import { redirect } from "next/navigation";
import Link from "next/link";
import MuiLink from "@mui/material/Link";

const pages = ["Dashboard", "Habits", "Goals", "Statistics"];
const settings = ["Profile", "Logout"];

export default function NavigationBar() {
  const { data: session } = useSession();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null,
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMenuItemClick = (setting: string) => {
    handleCloseUserMenu();

    switch (setting) {
      case "Profile":
        redirect("/profile");
      case "Logout":
        signOut();
        break;
      default:
        console.warn(`Unhandled setting: ${setting}`);
    }
  };

  if (!session) {
    return null;
  }

  return (
    <AppBar position="static" color="inherit">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <Link href="/">
              <HabitFlowIcon sx={{ mr: 0 }} />
            </Link>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages.map((page) => (
                <MuiLink
                  href={`/${page.toLowerCase()}`}
                  underline="none"
                  color="inherit"
                  key={page}
                  sx={{ textDecoration: "none" }}
                >
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Typography
                      sx={{ textAlign: "center", textDecoration: "none" }}
                    >
                      {page}
                    </Typography>
                  </MenuItem>
                </MuiLink>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/dashboard"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            HabitFlow
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <MuiLink
                href={`/${page.toLowerCase()}`}
                underline="none"
                color="inherit"
                key={page}
                sx={{
                  my: 2,
                  mr: 2,
                  display: "block",
                  textTransform: "none",
                  color: "text.primary",
                }}
              >
                {page}
              </MuiLink>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                {!session.user.image ? (
                  <AvatarIcon variant="square" sx={{ borderRadius: 1 }} />
                ) : (
                  <Avatar
                    alt={session.user.name ?? "User"}
                    src={session.user.image ?? undefined}
                  ></Avatar>
                )}
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={() => handleMenuItemClick(setting)}
                >
                  <Typography sx={{ textAlign: "center" }}>
                    {setting}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
