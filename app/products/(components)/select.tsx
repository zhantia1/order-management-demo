import { Autocomplete, Box, Grid, TextField, Typography } from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import { Product } from "@prisma/client";
import { useEffect, useState } from "react";
import { ProductSearchRequest } from "@/pages/api/product/search";
import { ProductGetRequest } from "@/pages/api/product/get";

export interface ProductSelectProps {
  idValue: string | null;
  onValueChange?: (selectedProduct: Product | null) => void;
  onIDChange?: (id: string | null) => void;
  disabled?: boolean;
}

export default function ProductSelect({
  idValue,
  onValueChange,
  onIDChange,
  disabled,
}: ProductSelectProps) {
  const [value, setValue] = useState<Product | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<readonly Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingOne, setLoadingOne] = useState(false);

  useEffect(() => {
    // if values match then no need to do anything
    if (value !== null && idValue === value.id) {
      return;
    }
    let active = true;

    // else fetch
    if (idValue) {
      const getProduct = async () => {
        const body: ProductGetRequest = {
          id: idValue,
        };
        try {
          const res = await fetch("/api/product/get", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
          const result = await res.json();
          if (active) {
            setValue(result ?? null);
          }
        } catch (error) {
          console.log(error);
        }
      };
      getProduct();
    }

    return () => {
      active = false;
    };
  }, [idValue, value]);

  useEffect(() => {
    let active = true;

    if (inputValue === "") {
      setOptions(value ? [value] : []);
      return undefined;
    }

    const fetchProducts = async () => {
      const body: ProductSearchRequest = {
        query: inputValue,
      };

      try {
        const res = await fetch("/api/product/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const results = await res.json();

        if (active) {
          let newOptions: readonly Product[] = [];
          if (value) {
            newOptions = [value];
          }
          if (results) {
            newOptions = [...newOptions, ...results];
          }

          setOptions(newOptions);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();

    return () => {
      active = false;
    };
  }, [value, inputValue]);

  const isLoading = (value === null && loading) || loadingOne;

  return (
    <Autocomplete
      disabled={disabled}
      loading={isLoading}
      getOptionLabel={(option) =>
        isLoading ? "Loading..." : `${option.name} (ID: ${option.id})`
      }
      filterOptions={(x) => x}
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={value}
      noOptionsText="Search for products..."
      onChange={(_, newValue: Product | null) => {
        setOptions(newValue ? [newValue, ...options] : options);
        onValueChange?.(newValue);
        onIDChange?.(newValue?.id ?? null);
      }}
      onInputChange={(_, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField {...params} label="Product" fullWidth required />
      )}
      renderOption={(props, option) => {
        return (
          <li {...props} key={option.id}>
            <Grid container alignItems="center">
              <Grid item sx={{ display: "flex", width: 44 }}>
                <InventoryIcon />
              </Grid>
              <Grid item>
                <Box component="span">{option.name}</Box>
              </Grid>
            </Grid>
          </li>
        );
      }}
    />
  );
}
