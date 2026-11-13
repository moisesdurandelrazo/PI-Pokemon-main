import Loading from "../Loading";
import { Box, Paper, Skeleton, Stack } from "@mui/material";

export default function PokemonDetailSkeleton() {
  return (
    <Loading message="Cargando detalles del Pokémon">
      <Box>
        <Skeleton width="50%" height={50} sx={{ mx: "auto", mb: 3 }} />
        <Paper className="detail-body" elevation={0}>
          <Skeleton variant="rounded" animation="wave" sx={{ width: "100%", height: "auto", aspectRatio: "1" }} />
          <Stack spacing={2}>
            <Skeleton width="85%" height={36} />
            <Skeleton width="100%" height={20} />
            <Skeleton variant="rounded" height={160} />
            <Skeleton width="30%" height={28} />
            <Skeleton variant="rounded" width="45%" height={24} />
            {Array.from({ length: 4 }, (_, index) => <Skeleton key={index} height={22} />)}
          </Stack>
        </Paper>
      </Box>
    </Loading>
  );
}
