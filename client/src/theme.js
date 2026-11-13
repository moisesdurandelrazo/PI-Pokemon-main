import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#388344" },
    secondary: { main: "#e3350d" },
    background: { default: "#f0f0ed", paper: "#ffffff" },
    text: { primary: "#313536", secondary: "#71796d" },
    divider: "#e1e6db",
  },
  typography: {
    fontFamily: '"Trebuchet MS", Arial, sans-serif',
    h1: { fontSize: "2.75rem", fontWeight: 700, letterSpacing: "-0.035em" },
    h2: { fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.025em" },
    h3: { fontSize: "1.25rem", fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 700 },
    overline: { fontSize: "0.65rem", letterSpacing: "0.16em", fontWeight: 700 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { minHeight: 42, paddingInline: 20 } },
    },
    MuiTextField: { defaultProps: { variant: "outlined", size: "small", fullWidth: true } },
    MuiFormControl: { defaultProps: { size: "small", fullWidth: true } },
    MuiOutlinedInput: { styleOverrides: { root: { backgroundColor: "#f8faf5" } } },
    MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
    MuiCard: { defaultProps: { variant: "outlined" } },
    MuiChip: { defaultProps: { size: "small" } },
    MuiLink: { defaultProps: { underline: "hover" } },
    MuiCssBaseline: {
      styleOverrides: {
        body: { minWidth: 320 },
        ":focus-visible": { outline: "3px solid #2786ba", outlineOffset: 4 },
      },
    },
  },
});

export default theme;
