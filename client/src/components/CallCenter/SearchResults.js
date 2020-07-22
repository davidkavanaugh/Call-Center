import React from 'react';
import MaterialTable from 'material-table';
import { withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import PropTypes from "prop-types";

class SearchResults extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        client: null,
      }
    }

    render() {
      return (
          <div id="search-results">
            <MaterialTable
                title="Search Results"
                columns={[
                    { title: 'First', field: 'firstName' },
                    { title: 'Last', field: 'lastName' },
                    { title: 'DOB', field: 'dob' },
                    { title: 'Phone', field: 'phoneNumber' }
                ]}
                data={this.props.data}
                onRowClick={((evt, client) => {
                  this.setState({ client })
                  this.props.history.push(`/call-center/${this.props.location.pathname.split('/').pop()}/client/${client._id}`, {clients: client, callCenter: this.props.location.pathname.split('/').pop()})
                })}
                options={{
                    search: false,
                    rowStyle: rowData => ({
                        height: '33px',
                        padding: '0px 0px',
                        backgroundColor: (this.state.selectedRow && this.state.selectedRow.tableData.id === rowData.tableData.id) ? '#EEE' : '#FFF'
                    })
                }}
            />
        </div>
      )
    }
  }

  SearchResults.propTypes = {
    client: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
  };
  
  const mapStateToProps = state => ({
    auth: state.auth,
    client: state.client
  });
  
  export default withRouter(connect(
    mapStateToProps,
  )(SearchResults));