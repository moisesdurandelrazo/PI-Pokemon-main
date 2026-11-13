import { Box, Card, CardContent, Skeleton, Stack } from "@mui/material";

export default function PokemonSkeleton() {
  return (
    <Card aria-hidden="true">
      <Skeleton variant="rectangular" animation="wave" sx={{ width: "100%", height: "auto", aspectRatio: "1" }} />
      <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
        <Skeleton width="35%" height={20} />
        <Skeleton width="75%" height={32} sx={{ my: 1 }} />
        <Stack direction="row" spacing={1}>
          <Box sx={{ width: "35%" }}><Skeleton variant="rounded" height={24} /></Box>
          <Box sx={{ width: "35%" }}><Skeleton variant="rounded" height={24} /></Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
