import React from 'react';
import Downshift from 'downshift';
import TextField from '@material-ui/core/TextField';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';

const axios = require('axios');

const styles = theme => ({
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0,
  },
  inputRoot: {
    flexWrap: 'wrap',
    backgroundColor: '#FAFAFA',
  },
  inputInput: {
    width: 'auto',
    flexGrow: 1,
  },
});

export class MathematicianSearch extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      searchResults: []
    };
    this.getSearchResults = this.getSearchResults.bind(this);
    this.renderInput = this.renderInput.bind(this);
    this.renderSearchResult = this.renderSearchResult.bind(this);
  }

  getSearchResults(value) {
    const inputValue = value.trim().toLowerCase();
    if(inputValue.length >= 2){
      axios.get('/api/search/',{
          params: {
              name: inputValue
          }
      }).then(response => {
        this.setState({
          searchResults: response.data.map((mathematician) => {
            return {
              label: mathematician.full_name,
              value: mathematician.id
            };
          })
        });
      });
    }
  }

  renderInput(inputProps) {
    const { InputProps, ref, ...other } = inputProps;
    const { classes } = this.props;

    return (
      <TextField
        InputProps={{
          inputRef: ref,
          ...InputProps,
          classes: {
            root: classes.inputRoot,
            input: classes.inputInput,
          }
        }}
        {...other}
      />
    );
  }

  renderSearchResult(searchResultProps) {
    const { searchResult, index, itemProps, highlightedIndex, selectedItem } = searchResultProps;
    const isHighlighted = highlightedIndex === index;
    const isSelected = (selectedItem || '').indexOf(searchResult.label) > -1;

    return (
      <MenuItem
        {...itemProps}
        key={searchResult.label}
        selected={isHighlighted}
        component="div"
        style={{
          fontWeight: isSelected ? 500 : 400,
        }}
      >
        {searchResult.label}
      </MenuItem>
    );
  }

  render() {
    const { classes } = this.props;

    return (
      <Downshift id="downshift-simple">
        {({
          getInputProps,
          getItemProps,
          getLabelProps,
          getMenuProps,
          highlightedIndex,
          inputValue,
          isOpen,
          selectedItem,
        }) => {
          const { onBlur, onFocus, ...inputProps } = getInputProps({
            placeholder: 'Search for a mathematician\'s name',
            onChange: ((event) => this.getSearchResults(event.target.value)),
          });

          return (
            <div className={classes.container}>
              {this.renderInput({
                fullWidth: true,
                InputLabelProps: getLabelProps({ shrink: true }),
                InputProps: { onBlur, onFocus },
                inputProps,
              })}

              <div {...getMenuProps()}>
                {isOpen ? (
                  <Paper className={classes.paper} square>
                    {this.state.searchResults.map((searchResult, index) =>
                      this.renderSearchResult({
                        searchResult,
                        index,
                        itemProps: getItemProps({
                          item: searchResult.label,
                          style: {
                            backgroundColor: '#FAFAFA'
                          }
                        }),
                        highlightedIndex,
                        selectedItem,
                      }),
                    )}
                  </Paper>
                ) : null}
              </div>
            </div>
          );
        }}
      </Downshift>
    );
  }
}

export default withStyles(styles)(MathematicianSearch);
