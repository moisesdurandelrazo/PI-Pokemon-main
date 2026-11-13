import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import PropTypes from "prop-types";

/** A shared loading status with a spinner or a custom skeleton layout. */
export default function Loading({ message = "Cargando…", children, size = 28, className, sx = {} }) {
  const customContent = children != null;

  return (
    <Box
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={message}
      className={className}
      sx={[...(customContent ? [] : [{ py: 7, textAlign: "center" }]), ...(Array.isArray(sx) ? sx : [sx])]}
    >
      {customContent ? (
        <>
          <Box component="span" sx={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clipPath: "inset(50%)", whiteSpace: "nowrap" }}>{message}</Box>
          <Box aria-hidden="true" sx={{ display: "contents" }}>{children}</Box>
        </>
      ) : (
        <Stack spacing={2} alignItems="center">
          <CircularProgress size={size} aria-hidden="true" />
          <Typography color="text.secondary">{message}</Typography>
        </Stack>
      )}
    </Box>
  );
}

Loading.propTypes = {
  message: PropTypes.string,
  children: PropTypes.node,
  size: PropTypes.number,
  className: PropTypes.string,
  sx: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.func]),
};
