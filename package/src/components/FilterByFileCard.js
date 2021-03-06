import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import {
  Grid,
  Zoom,
  Button,
  Card as MuiCard,
  CardHeader,
  CardContent,
  IconButton,
  Typography,
  makeStyles
} from "@material-ui/core";
import CloseIcon from "mdi-material-ui/Close";
import ImportIcon from "mdi-material-ui/Download";
import { Chip } from "@reactioncommerce/catalyst";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  cardContainer: {
    alignItems: "center"
  },
  hidden: {
    display: "none"
  },
  visible: {
    display: "block"
  },
  helpText: {
    marginLeft: theme.spacing(2)
  },
  leftIcon: {
    marginRight: theme.spacing(1)
  },
  leftChip: {
    marginRight: theme.spacing(1)
  }
}));

/**
 * FilterByFileCard component
 * @param {Object} props Component props
 * @returns {React.Component} A React component
 */
export default function FilterByFileCard(props) {
  const {
    files,
    getInputProps,
    getRootProps,
    handleDelete,
    importFiles,
    isFilterByFileVisible,
    setFilterByFileVisible
  } = props;
  const classes = useStyles();
  const { t } = useTranslation();

  const cardClasses = clsx({
    [classes.hidden]: true,
    [classes.visible]: isFilterByFileVisible
  });

  return (
    <Grid item sm={12} className={cardClasses}>
      <Zoom
        in={isFilterByFileVisible}
        mountOnEnter
        unmountOnExit
      >
        <MuiCard>
          <CardHeader
            action={
              <IconButton aria-label="close" onClick={() => setFilterByFileVisible(false)}>
                <CloseIcon />
              </IconButton>
            }
            title={t("admin.importCard.title")}
          />
          <CardContent>
            {files.length > 0 ? (
              <Grid container spacing={1} className={classes.cardContainer}>
                <Grid item sm={12}>
                  {
                    files.map((file, index) => (
                      <Chip
                        label={file.name}
                        key={index}
                        className={classes.leftChip}
                        onDelete={() => handleDelete(file.name)}
                      />
                    ))
                  }
                </Grid>
                <Grid item sm={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ float: "right" }}
                    onClick={() => importFiles(files)}
                  >
                    {t("admin.importCard.filterProducts")}
                  </Button>
                </Grid>
              </Grid>
            ) : (
              <Grid container spacing={1} className={classes.cardContainer}>
                <Grid item sm={12}>
                  <Button
                    {...getRootProps({ className: "dropzone" })}
                    variant="contained"
                    color="primary"
                  >
                    <input {...getInputProps()} />
                    <ImportIcon className={classes.leftIcon} />
                    {t("admin.importCard.import")}
                  </Button>
                  <Typography variant="caption" display="inline" className={classes.helpText}>
                    {t("admin.importCard.importHelpText")}
                  </Typography>
                </Grid>
              </Grid>
            )}
          </CardContent>
        </MuiCard>
      </Zoom>
    </Grid>
  );
}

FilterByFileCard.propTypes = {
  files: PropTypes.array,
  getInputProps: PropTypes.func,
  getRootProps: PropTypes.func,
  handleDelete: PropTypes.func,
  importFiles: PropTypes.func,
  isFilterByFileVisible: PropTypes.bool,
  setFilterByFileVisible: PropTypes.func
};

