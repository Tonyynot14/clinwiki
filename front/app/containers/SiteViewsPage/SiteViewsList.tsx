import * as React from "react";
import styled from "styled-components";
import { gql } from "apollo-boost";
import { capitalize, trimPath } from "utils/helpers";
import { SiteFragment } from "types/SiteFragment";
import StyledButton from "containers/LoginPage/StyledButton";
import { SiteViewFragment } from "types/SiteViewFragment";
import CollapsiblePanel from "components/CollapsiblePanel";
import { SiteViewItem } from "components/SiteItem";
import {
  Checkbox,
  Row,
  Col,
  Button,
  Table,
  FormControl
} from "react-bootstrap";
import CreateSiteViewMutation, {
  CreateSiteViewMutationFn
} from "mutations/CreateSiteViewMutation";
import { History, Location } from "history";

interface SiteViewsListProps {
  site: any;
  refresh: any;
  match: any;
  history: History;
  location: Location;
  onAddMutation: (e: { currentTarget: { name: string; value: any } }) => void;
}

interface SiteViewsListState {
  form: {
    siteViewName: string;
    siteViewPath: string;
  };
  id: string | undefined;
}

const StyledContainer = styled.div`
  padding: 20px;
  h3,
  h4,
  h5 {
    color: white;
  }
`;

class SiteViewsList extends React.Component<
  SiteViewsListProps,
  SiteViewsListState
> {
  state: SiteViewsListState = {
    form: {
      siteViewName: "",
      siteViewPath: ""
    },
    id: undefined
  };

  handleSave = (createSiteView: CreateSiteViewMutationFn) => {
    const { form } = this.state;

    createSiteView({
      variables: {
        input: {
          name: form.siteViewName,
          url: form.siteViewPath,
          description: "description",
          default: false,
          mutations: [],
          siteId: this.props.site.id
        }
      }
    }).then(res => {
      this.props.refresh();
      this.setState({
        form: {
          siteViewName: "",
          siteViewPath: ""
        }
      });
    });
  };

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      form: { ...this.state.form, [e.target.name as any]: e.target.value }
    });
  };

  render() {
    const { siteViews } = this.props.site;
    const { refresh } = this.props;

    return (
      <CreateSiteViewMutation>
        {createSiteView => (
          <StyledContainer>
            <CollapsiblePanel header="My Site Views">
              {siteViews.length > 0 && (
                <Table striped bordered condensed>
                  <thead>
                    <tr>
                      <th>Site Name</th>
                      <th>URL</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    <>
                      {siteViews.map(view => (
                        <SiteViewItem
                          siteView={view}
                          refresh={refresh}
                          onAddMutation={this.props.onAddMutation}
                          match={this.props.match}
                          history={this.props.history}
                          location={this.props.location}
                        />
                      ))}
                    </>
                    <tr>
                      <td>
                        <FormControl
                          name="siteViewName"
                          placeholder="Site Name"
                          value={this.state.form.siteViewName}
                          onChange={this.handleInputChange}
                        />
                      </td>
                      <td>
                        <FormControl
                          name="siteViewPath"
                          placeholder="Site View Path"
                          value={this.state.form.siteViewPath}
                          onChange={this.handleInputChange}
                        />
                      </td>
                      <td>
                        <StyledButton
                          onClick={() => {
                            this.handleSave(createSiteView);
                          }}
                        >
                          + Add Site View
                        </StyledButton>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              )}
            </CollapsiblePanel>
          </StyledContainer>
        )}
      </CreateSiteViewMutation>
    );
  }
}

export default SiteViewsList;