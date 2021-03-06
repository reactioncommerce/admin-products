import React, { useState } from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import DotsHorizontalIcon from "mdi-material-ui/DotsHorizontal";
import ConfirmDialog from "@reactioncommerce/catalyst/ConfirmDialog";
import { makeStyles, Box, Divider } from "@material-ui/core";
import useProduct from "../hooks/useProduct";

const useStyles = makeStyles((theme) => ({
  breadcrumbs: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(2)
  },
  breadcrumbIcon: {
    fontSize: 14,
    marginRight: 7
  },
  breadcrumbLink: {
    fontSize: "14px",
    fontFamily: theme.typography.fontFamily,
    color: "#3c3c3c",
    border: 0,
    marginRight: 7
  }
}));

/**
 * Header component for various product admin forms
 * @param {Object} props Component props
 * @returns {Node} React component
 */
function ProductHeader({ shouldDisplayStatus }) {
  const classes = useStyles();
  const [menuAnchorEl, setMenuAnchorEl] = useState();
  const { t } = useTranslation();
  const {
    onArchiveProduct,
    onCreateVariant,
    onRestoreProduct,
    onCloneProduct,
    onToggleProductVisibility,
    product,
    variant,
    option
  } = useProduct();

  if (!product) {
    return null;
  }

  // TODO: Update to pull permissions from the API / Auth service
  const hasCloneProductPermission = true; // reaction:legacy:products/clone
  const hasArchiveProductPermission = true; // reaction:legacy:products/archive

  // Archive menu item
  let archiveMenuItem = (
    <ConfirmDialog
      title={t("admin.productTable.bulkActions.archiveTitle")}
      message={t("productDetailEdit.archiveThisProduct")}
      onConfirm={() => {
        let redirectUrl;

        if (option) {
          redirectUrl = `/products/${product._id}/${variant._id}`;
        } else if (variant) {
          redirectUrl = `/products/${product._id}`;
        } else {
          redirectUrl = "/products";
        }

        onArchiveProduct(product._id, redirectUrl);
      }}
    >
      {({ openDialog }) => (
        <MenuItem onClick={openDialog}>{t("admin.productTable.bulkActions.archive")}</MenuItem>
      )}
    </ConfirmDialog>
  );

  if (product.isDeleted) {
    archiveMenuItem = (
      <ConfirmDialog
        title={t("admin.productTable.bulkActions.restoreTitle")}
        message={t("productDetailEdit.restoreThisProduct")}
        onConfirm={() => {
          onRestoreProduct(product._id);
          setMenuAnchorEl(null);
        }}
      >
        {({ openDialog }) => (
          <MenuItem onClick={openDialog}>{t("admin.productTable.bulkActions.restore")}</MenuItem>
        )}
      </ConfirmDialog>
    );
  }

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
      >
        <Box
          display="flex"
          flexDirection="column"
          flex="1"
        >
          <Link className={classes.breadcrumbLink} to={`/products/${product._id}`}>
            <Typography variant="h2">
              <Helmet title={product.title} />
              {product.title || "Untitled Product"}
            </Typography>
          </Link>
          {shouldDisplayStatus &&
            <Box>
              <Typography variant="caption">
                {product.isVisible ? "Visible" : "Hidden"}
                {product.isDeleted ? t("app.archived") : null}
              </Typography>
            </Box>
          }
        </Box>

        <IconButton
          onClick={(event) => {
            setMenuAnchorEl(event.currentTarget);
          }}
        >
          <DotsHorizontalIcon />
        </IconButton>
      </Box>

      <Menu
        id="bulk-actions-menu"
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={() => setMenuAnchorEl(null)}
      >
        <MenuItem
          onClick={async () => {
            await onCreateVariant({
              parentId: product._id,
              redirectOnCreate: true
            });
            setMenuAnchorEl(null);
          }}
        >
          {t("variantList.createVariant")}
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            onToggleProductVisibility(product);
            setMenuAnchorEl(null);
          }}
        >
          {product.isVisible ?
            t("admin.productTable.bulkActions.makeHidden") :
            t("admin.productTable.bulkActions.makeVisible")
          }
        </MenuItem>
        {hasCloneProductPermission &&
          <MenuItem
            onClick={() => {
              onCloneProduct(product._id);
              setMenuAnchorEl(null);
            }}
          >
            {t("admin.productTable.bulkActions.duplicate")}
          </MenuItem>
        }
        {hasArchiveProductPermission &&
          archiveMenuItem
        }
      </Menu>
    </>
  );
}

ProductHeader.propTypes = {
  shouldDisplayStatus: PropTypes.bool
};

export default ProductHeader;
