import * as React from 'react';
import { Row, Col, Panel, PanelGroup, DropdownButton, MenuItem } from 'react-bootstrap';
import { SiteViewFragment } from 'types/SiteViewFragment';
import { displayFields } from 'utils/siteViewHelpers';
import { StyledContainer, StyledFormControl, StyledLabel } from './Styled';
import MultiInput from 'components/MultiInput';
import AggField from './AggField';
import { sentanceCase } from 'utils/helpers';
import { aggsOrdered, studyFields } from 'utils/constants';
import aggToField from 'utils/aggs/aggToField';
import { FilterKind } from 'types/globalTypes';
import { Checkbox, ToggleButtonGroup, ToggleButton, Button } from 'react-bootstrap';
import styled from 'styled-components';
import { match } from 'react-router';
// import { Button } from 'react-bootstrap';
import { CreateSiteInput, SiteViewMutationInput } from 'types/globalTypes';
import UpdateSiteViewMutation, {
  UpdateSiteViewMutationFn,
} from 'mutations/UpdateSiteViewMutation';
import {
  updateView,
  createMutation,
  getViewValueByPath,
  serializeMutation,
} from 'utils/siteViewUpdater';
import { equals, prop, last, view } from 'ramda';
import { History, Location } from 'history';

interface SearchFormProps {
  match: match<{ id: string }>;
  view: SiteViewFragment;
  siteViews: any;
  siteViewId: any;
  history: History;
  location: Location;
  site: any;
}

interface SearchFormState {
  showAllAggs: boolean;
  showAllCrowdAggs: boolean;
  mutations: SiteViewMutationInput[];
  showFacetBar: boolean;
  showFacetBarConfig: boolean;
}

const SEARCH_FIELDS = studyFields.map(option => ({
  id: option,
  label: sentanceCase(option),
}));

const AGGS_OPTIONS = aggsOrdered.map(option => ({
  id: option,
  label: sentanceCase(aggToField(option)),
}));

const AggsHeaderContainer = styled.div`
  display: flex;
  color: white;
  align-items: center;
  justify-content: space-between;
  margin: 25px 0 10px 0;

  h3 {
    margin: 0;
  }
`;

const StyledButton = styled(Button)`
  margin-right: 15px;
`;

const StyledCheckbox = styled(Checkbox)`
  display: flex;
  align-items: center;
`;

// const styledToggleButton = styled(ToggleButtonGroup)`
//   diplay: flex;
//   flex-direction: row;
//   `

class SearchForm extends React.Component<SearchFormProps, SearchFormState> {
  state: SearchFormState = {
    showAllAggs: false,
    showAllCrowdAggs: false,
    mutations: [],
    showFacetBar: false,
    showFacetBarConfig:false,
  };

  componentDidMount() {}

  handleSave = (updateSiteView: UpdateSiteViewMutationFn, view: any) => (
    mutations: SiteViewMutationInput[]
  ) => {
    updateSiteView({
      variables: {
        input: {
          mutations: this.state.mutations.map(serializeMutation),
          id: view.id,
          name: view.name,
          url: view.url,
          default: view.default,
          //@ts-ignore
          // showFacetBar: view.search.config.fields.showFacetBar
        },
      },
    });
  };

  handleAddMutation = (
    e: { currentTarget: { name: string; value: any } },
    siteView
  ) => {
    const { name, value } = e.currentTarget;
    const mutation = createMutation(name, value);
    const view = updateView(siteView, this.state.mutations);
    const currentValue = getViewValueByPath(mutation.path, view);
    if (equals(value, currentValue)) return;
    this.setState({ mutations: [...this.state.mutations, mutation] }, () => {
      console.log('MUTATIONS', this.state.mutations);
    });
  };

  getCrowdFields = view => {
    return view.search.crowdAggs.fields.map(field => ({
      id: field.name,
      label: sentanceCase(field.name),
    }));
  };

  handleShowAllToggle = (kind: 'aggs' | 'crowdAggs') => () => {
    if (kind == 'aggs') {
      this.setState({ showAllAggs: !this.state.showAllAggs });
    } else {
      this.setState({ showAllCrowdAggs: !this.state.showAllCrowdAggs });
    }
  };

  handleFieldsOrderChange = () => {};

  handleShowFacetBar = (x, view, name) => {
    // this.setState({showFacetBar: x})
    const e = { currentTarget: { name: name, value: x } };
    this.handleAddMutation(e, view);
  };

  render() {
    const siteviewId = this.props.match.params.id;
    let view = this.props.siteViews.find(view => siteviewId == view.id);
    view = updateView(view, this.state.mutations);
    const { site } = this.props;
    const fields = displayFields(
      this.state.showAllAggs
        ? FilterKind.BLACKLIST
        : view.search.aggs.selected.kind,
      this.state.showAllAggs ? [] : view.search.aggs.selected.values,
      view.search.aggs.fields
    );
    const crowdFields = displayFields(
      this.state.showAllCrowdAggs
        ? FilterKind.BLACKLIST
        : view.search.crowdAggs.selected.kind,
      this.state.showAllCrowdAggs ? [] : view.search.crowdAggs.selected.values,
      view.search.crowdAggs.fields
    );
    const showFacetBar = view.search.config.fields.showFacetBar;
    // const config = displayFields(
    //   this.state.showFacetBar
    //     ? false : view.search.config.showfacetBar,
    //     this.state.showFacetBar ? false : view.search.config.showFacetBar

    // );
    // console.log('Facet bar set to:', view.search.config.fields.showFacetBar);
    const showBreadCrumbs = view.search.config.fields.showBreadCrumbs;
    // console.log("Crumbs bar set to:",view.search.config.fields.showBreadCrumbs)
    const showAutoSuggest = view.search.config.fields.showAutoSuggest;
    // console.log("Crumbs bar set to:",view.search.config.fields.showAutoSuggest)
    const showResults = view.search.config.fields.showResults;
    // console.log("Results set to:",view.search.config.fields.showResults)
    const showPresearch = view.search.config.fields.showPresearch
    console.log("Presearch set to:",view.search.config.fields.showPresearch)
    return (
      <UpdateSiteViewMutation
        onCompleted={() =>
          this.props.history.push(`/sites/${site.id}/edit/siteviews`)
        }>
        {updateSiteView => (
          <StyledContainer>
            <h1>Search Name: {view.name}</h1>
           
            <h3>Search Sections</h3>
            <PanelGroup  id="accordion-uncontrolled"> 
              <Panel >
                <Panel.Heading>
                  <Panel.Title toggle>Facet Bar</Panel.Title>
                </Panel.Heading>
                <Panel.Body collapsible>
                <ToggleButtonGroup
                name="set:search.config.fields.showFacetBar"
                type="radio"
                value={showFacetBar}
                // defaultValue={view.search.config.fields.showFacetBar}
                onChange={val =>
                  this.handleShowFacetBar(
                    val,
                    view,
                    'set:search.config.fields.showFacetBar'
                  )
                }>
                <ToggleButton value={true}>Shown</ToggleButton>
                <ToggleButton value={false}>Hidden</ToggleButton>
              </ToggleButtonGroup>
              <Row>
                <Col md={6}>
                  <AggsHeaderContainer>
                    <h3>Aggs visibility</h3>
                    <StyledCheckbox 
                      checked={this.state.showAllAggs}
                      onChange={this.handleShowAllToggle('aggs')}>
                          Show all
                        </StyledCheckbox>
                      </AggsHeaderContainer>
                      <StyledLabel>Filter</StyledLabel>
                      <StyledFormControl
                        name="set:search.aggs.selected.kind"
                        componentClass="select"
                        onChange={e => this.handleAddMutation(e, view)}
                        value={view.search.aggs.selected.kind}>
                        <option value="BLACKLIST">All except</option>
                        <option value="WHITELIST">Only</option>
                      </StyledFormControl>
                      <MultiInput
                        name="set:search.aggs.selected.values"
                        options={AGGS_OPTIONS}
                        placeholder="Add facet"
                        value={view.search.aggs.selected.values}
                        onChange={e => this.handleAddMutation(e, view)}
                      />
                      <h3>Aggs settings</h3>
                      {fields.map(field => (
                        <AggField
                          kind="aggs"
                          key={field.name}
                          //@ts-ignore
                          field={field}
                          onAddMutation={this.handleAddMutation}
                          view={view}
                        />
                      ))}
                    </Col>
                    <Col md={6}>
                      <AggsHeaderContainer>
                        <h3>Crowd aggs visibility</h3>
                        <StyledCheckbox
                          checked={this.state.showAllCrowdAggs}
                          onChange={this.handleShowAllToggle('crowdAggs')}>
                          Show all
                        </StyledCheckbox>
                      </AggsHeaderContainer>
                      <StyledLabel>Filter</StyledLabel>
                      <StyledFormControl
                        name="set:search.crowdAggs.selected.kind"
                        componentClass="select"
                        onChange={(e: { currentTarget: { name: string; value: any; }; }) => this.handleAddMutation(e, view)}
                        v={view.search.crowdAggs.selected.kind}>
                        <option value="BLACKLIST">All except</option>
                        <option value="WHITELIST">Only</option>
                      </StyledFormControl>
                      <MultiInput
                        name="set:search.crowdAggs.selected.values"
                        options={this.getCrowdFields(view)}
                        placeholder="Add facet"
                        value={view.search.crowdAggs.selected.values}
                        onChange={e => this.handleAddMutation(e, view)}
                      />
                      <h3>Crowd aggs settings</h3>
                      {crowdFields.map(field => (
                        <AggField
                          kind="crowdAggs"
                          key={field.name}
                          //@ts-ignore
                          field={field}
                          onAddMutation={this.handleAddMutation}
                          view={view}
                        />
                      ))}
                    </Col>
                  </Row>
            <StyledButton onClick={this.handleSave(updateSiteView, view)}>
              Save Site View
            </StyledButton>
                </Panel.Body>
              </Panel>
              <Panel>
                <Panel.Heading>
                  <Panel.Title toggle>Auto Suggest</Panel.Title>
                </Panel.Heading>
                <Panel.Body collapsible>
                <ToggleButtonGroup
                name="set:search.config.fields.showAutoSuggest"
                type="radio"
                value={showAutoSuggest}
                // defaultValue={view.search.config.fields.showFacetBar}
                onChange={val =>
                  this.handleShowFacetBar(
                    val,
                    view,
                    'set:search.config.fields.showAutoSuggest'
                  )
                }>
                <ToggleButton value={true}>Shown</ToggleButton>
                <ToggleButton value={false}>Hidden</ToggleButton>
              </ToggleButtonGroup>
              <Row>
                <Col md={6}>
                  <AggsHeaderContainer>
                    <h3>Aggs visibility</h3>
                    <StyledCheckbox 
                      checked={this.state.showAllAggs}
                      onChange={this.handleShowAllToggle('aggs')}>
                          Show all
                        </StyledCheckbox>
                      </AggsHeaderContainer>
                      <StyledLabel>Filter</StyledLabel>
                      <StyledFormControl
                        name="set:search.aggs.selected.kind"
                        componentClass="select"
                        onChange={e => this.handleAddMutation(e, view)}
                        value={view.search.aggs.selected.kind}>
                        <option value="BLACKLIST">All except</option>
                        <option value="WHITELIST">Only</option>
                      </StyledFormControl>
                      <MultiInput
                        name="set:search.aggs.selected.values"
                        options={AGGS_OPTIONS}
                        placeholder="Add facet"
                        value={view.search.aggs.selected.values}
                        onChange={e => this.handleAddMutation(e, view)}
                      />
                      <h3>Aggs settings</h3>
                      {fields.map(field => (
                        <AggField
                          kind="aggs"
                          key={field.name}
                          //@ts-ignore
                          field={field}
                          onAddMutation={this.handleAddMutation}
                          view={view}
                        />
                      ))}
                    </Col>
                    <Col md={6}>
                      <AggsHeaderContainer>
                        <h3>Crowd aggs visibility</h3>
                        <StyledCheckbox
                          checked={this.state.showAllCrowdAggs}
                          onChange={this.handleShowAllToggle('crowdAggs')}>
                          Show all
                        </StyledCheckbox>
                      </AggsHeaderContainer>
                      <StyledLabel>Filter</StyledLabel>
                      <StyledFormControl
                        name="set:search.crowdAggs.selected.kind"
                        componentClass="select"
                        onChange={(e: { currentTarget: { name: string; value: any; }; }) => this.handleAddMutation(e, view)}
                        v={view.search.crowdAggs.selected.kind}>
                        <option value="BLACKLIST">All except</option>
                        <option value="WHITELIST">Only</option>
                      </StyledFormControl>
                      <MultiInput
                        name="set:search.crowdAggs.selected.values"
                        options={this.getCrowdFields(view)}
                        placeholder="Add facet"
                        value={view.search.crowdAggs.selected.values}
                        onChange={e => this.handleAddMutation(e, view)}
                      />
                      <h3>Crowd aggs settings</h3>
                      {crowdFields.map(field => (
                        <AggField
                          kind="crowdAggs"
                          key={field.name}
                          //@ts-ignore
                          field={field}
                          onAddMutation={this.handleAddMutation}
                          view={view}
                        />
                      ))}
                    </Col>
                  </Row>
            <StyledButton onClick={this.handleSave(updateSiteView, view)}>
              Save Site View
            </StyledButton>
                </Panel.Body>
              </Panel>
              <Panel>
                <Panel.Heading>
                  <Panel.Title toggle>Pre-Search</Panel.Title>
                </Panel.Heading>
                <Panel.Body collapsible>
                <ToggleButtonGroup
                name="set:search.config.fields.showPresearch"
                type="radio"
                value={showPresearch}
                // defaultValue={view.search.config.fields.showFacetBar}
                onChange={val =>
                  this.handleShowFacetBar(
                    val,
                    view,
                    'set:search.config.fields.showPresearch'
                  )
                }>
                <ToggleButton value={true}>Shown</ToggleButton>
                <ToggleButton value={false}>Hidden</ToggleButton>
              </ToggleButtonGroup>
    
              <Row>
                <Col md={6}>
                  <AggsHeaderContainer>
                    <h3>Aggs visibility</h3>
                    <StyledCheckbox 
                      checked={this.state.showAllAggs}
                      onChange={this.handleShowAllToggle('aggs')}>
                          Show all
                        </StyledCheckbox>
                      </AggsHeaderContainer>
                      <StyledLabel>Filter</StyledLabel>
                      <StyledFormControl
                        name="set:search.aggs.selected.kind"
                        componentClass="select"
                        onChange={e => this.handleAddMutation(e, view)}
                        value={view.search.aggs.selected.kind}>
                        <option value="BLACKLIST">All except</option>
                        <option value="WHITELIST">Only</option>
                      </StyledFormControl>
                      <MultiInput
                        name="set:search.aggs.selected.values"
                        options={AGGS_OPTIONS}
                        placeholder="Add facet"
                        value={view.search.aggs.selected.values}
                        onChange={e => this.handleAddMutation(e, view)}
                      />
                      <h3>Aggs settings</h3>
                      {fields.map(field => (
                        <AggField
                          kind="aggs"
                          key={field.name}
                          //@ts-ignore
                          field={field}
                          onAddMutation={this.handleAddMutation}
                          view={view}
                        />
                      ))}
                    </Col>
                    <Col md={6}>
                      <AggsHeaderContainer>
                        <h3>Crowd aggs visibility</h3>
                        <StyledCheckbox
                          checked={this.state.showAllCrowdAggs}
                          onChange={this.handleShowAllToggle('crowdAggs')}>
                          Show all
                        </StyledCheckbox>
                      </AggsHeaderContainer>

                      <StyledLabel>Filter</StyledLabel>
                      <StyledFormControl
                        name="set:search.crowdAggs.selected.kind"
                        componentClass="select"
                        onChange={(e: { currentTarget: { name: string; value: any; }; }) => this.handleAddMutation(e, view)}
                        v={view.search.crowdAggs.selected.kind}>
                        <option value="BLACKLIST">All except</option>
                        <option value="WHITELIST">Only</option>
                      </StyledFormControl>
                      <MultiInput
                        name="set:search.crowdAggs.selected.values"
                        options={this.getCrowdFields(view)}
                        placeholder="Add facet"
                        value={view.search.crowdAggs.selected.values}
                        onChange={e => this.handleAddMutation(e, view)}
                      />
                      <h3>Crowd aggs settings</h3>
                      {crowdFields.map(field => (
                        <AggField
                          kind="crowdAggs"
                          key={field.name}
                          //@ts-ignore
                          field={field}
                          onAddMutation={this.handleAddMutation}
                          view={view}
                        />
                      ))}
                    </Col>
                  </Row>
            <StyledButton onClick={this.handleSave(updateSiteView, view)}>
              Save Site View
            </StyledButton>
                </Panel.Body>
              </Panel>
              <Panel>
                <Panel.Heading>
                  <Panel.Title toggle>Results</Panel.Title>
                </Panel.Heading>
                <Panel.Body collapsible>
                <ToggleButtonGroup
                name="set:search.config.fields.showResults"
                type="radio"
                value={showResults}
                // defaultValue={view.search.config.fields.showFacetBar}
                onChange={val =>
                  this.handleShowFacetBar(
                    val,
                    view,
                    'set:search.config.fields.showResults'
                  )
                }>
                <ToggleButton value={true}>Shown</ToggleButton>
                <ToggleButton value={false}>Hidden</ToggleButton>
              </ToggleButtonGroup>
              <h3>Fields</h3>
            <MultiInput
              name="set:search.fields"
              options={SEARCH_FIELDS}
              placeholder="Add field"
              draggable
              value={view.search.fields}
              onChange={e => this.handleAddMutation(e, view)}
            />
            
                        <DropdownButton
                  bsStyle="default"
                  title="Result View"
                  key="default"
                  id="dropdown-basic-default"
                >
                  <MenuItem eventKey="1">Card View</MenuItem>
                  <MenuItem eventKey="2">Grid View</MenuItem>
                  <MenuItem divider />
                  <MenuItem eventKey="4">Separated link</MenuItem>
                </DropdownButton>

            <StyledButton onClick={this.handleSave(updateSiteView, view)}>
              Save Site View
            </StyledButton>
                </Panel.Body>
              </Panel>
              <Panel>
                <Panel.Heading>
                  <Panel.Title toggle>Bread Crumbs Bar</Panel.Title>
                </Panel.Heading>
                <Panel.Body collapsible>
                <ToggleButtonGroup
                name="set:search.config.fields.showBreadCrumbs"
                type="radio"
                value={showBreadCrumbs}
                // defaultValue={view.search.config.fields.showFacetBar}
                onChange={val =>
                  this.handleShowFacetBar(
                    val,
                    view,
                    'set:search.config.fields.showBreadCrumbs'
                  )
                }>
                <ToggleButton value={true}>Shown</ToggleButton>
                <ToggleButton value={false}>Hidden</ToggleButton>
              </ToggleButtonGroup>
    
              <Row>
                <Col md={6}>
                  <AggsHeaderContainer>
                    <h3>Aggs visibility</h3>
                    <StyledCheckbox 
                      checked={this.state.showAllAggs}
                      onChange={this.handleShowAllToggle('aggs')}>
                          Show all
                        </StyledCheckbox>
                      </AggsHeaderContainer>
                      <StyledLabel>Filter</StyledLabel>
                      <StyledFormControl
                        name="set:search.aggs.selected.kind"
                        componentClass="select"
                        onChange={e => this.handleAddMutation(e, view)}
                        value={view.search.aggs.selected.kind}>
                        <option value="BLACKLIST">All except</option>
                        <option value="WHITELIST">Only</option>
                      </StyledFormControl>
                      <MultiInput
                        name="set:search.aggs.selected.values"
                        options={AGGS_OPTIONS}
                        placeholder="Add facet"
                        value={view.search.aggs.selected.values}
                        onChange={e => this.handleAddMutation(e, view)}
                      />
                      <h3>Aggs settings</h3>
                      {fields.map(field => (
                        <AggField
                          kind="aggs"
                          key={field.name}
                          //@ts-ignore
                          field={field}
                          onAddMutation={this.handleAddMutation}
                          view={view}
                        />
                      ))}
                    </Col>
                    <Col md={6}>
                      <AggsHeaderContainer>
                        <h3>Crowd aggs visibility</h3>
                        <StyledCheckbox
                          checked={this.state.showAllCrowdAggs}
                          onChange={this.handleShowAllToggle('crowdAggs')}>
                          Show all
                        </StyledCheckbox>
                      </AggsHeaderContainer>

                      <StyledLabel>Filter</StyledLabel>
                      <StyledFormControl
                        name="set:search.crowdAggs.selected.kind"
                        componentClass="select"
                        onChange={(e: { currentTarget: { name: string; value: any; }; }) => this.handleAddMutation(e, view)}
                        v={view.search.crowdAggs.selected.kind}>
                        <option value="BLACKLIST">All except</option>
                        <option value="WHITELIST">Only</option>
                      </StyledFormControl>
                      <MultiInput
                        name="set:search.crowdAggs.selected.values"
                        options={this.getCrowdFields(view)}
                        placeholder="Add facet"
                        value={view.search.crowdAggs.selected.values}
                        onChange={e => this.handleAddMutation(e, view)}
                      />
                      <h3>Crowd aggs settings</h3>
                      {crowdFields.map(field => (
                        <AggField
                          kind="crowdAggs"
                          key={field.name}
                          //@ts-ignore
                          field={field}
                          onAddMutation={this.handleAddMutation}
                          view={view}
                        />
                      ))}
                    </Col>
                  </Row>
            <StyledButton onClick={this.handleSave(updateSiteView, view)}>
              Save Site View
            </StyledButton>
                </Panel.Body>
              </Panel>
              {/* <Panel eventKey="6">
                <Panel.Heading>
                  <Panel.Title toggle>Panel heading 2</Panel.Title>
                </Panel.Heading>
                <Panel.Body collapsible>Panel content 2</Panel.Body>
              </Panel> */}
            </PanelGroup>
            
{/*             
            <h1>OG STUFF</h1>
            <h3>Fields</h3>
            <MultiInput
              name="set:search.fields"
              options={SEARCH_FIELDS}
              placeholder="Add field"
              draggable
              value={view.search.fields}
              onChange={e => this.handleAddMutation(e, view)}
            />
            <Row>
              <Col md={6}>
                <AggsHeaderContainer>
                  <h3>Aggs visibility</h3>
                  <StyledCheckbox
                    checked={this.state.showAllAggs}
                    onChange={this.handleShowAllToggle('aggs')}>
                    Show all
                  </StyledCheckbox>
                </AggsHeaderContainer>
                <StyledLabel>Filter</StyledLabel>
                <StyledFormControl
                  name="set:search.aggs.selected.kind"
                  componentClass="select"
                  onChange={e => this.handleAddMutation(e, view)}
                  value={view.search.aggs.selected.kind}>
                  <option value="BLACKLIST">All except</option>
                  <option value="WHITELIST">Only</option>
                </StyledFormControl>
                <MultiInput
                  name="set:search.aggs.selected.values"
                  options={AGGS_OPTIONS}
                  placeholder="Add facet"
                  value={view.search.aggs.selected.values}
                  onChange={e => this.handleAddMutation(e, view)}
                />
                <h3>Aggs settings</h3>
                {fields.map(field => (
                  <AggField
                    kind="aggs"
                    key={field.name}
                    //@ts-ignore
                    field={field}
                    onAddMutation={this.handleAddMutation}
                    view={view}
                  />
                ))}
              </Col>
              <Col md={6}>
                <AggsHeaderContainer>
                  <h3>Crowd aggs visibility</h3>
                  <StyledCheckbox
                    checked={this.state.showAllCrowdAggs}
                    onChange={this.handleShowAllToggle('crowdAggs')}>
                    Show all
                  </StyledCheckbox>
                </AggsHeaderContainer>

                <StyledLabel>Filter</StyledLabel>
                <StyledFormControl
                  name="set:search.crowdAggs.selected.kind"
                  componentClass="select"
                  onChange={e => this.handleAddMutation(e, view)}
                  v={view.search.crowdAggs.selected.kind}>
                  <option value="BLACKLIST">All except</option>
                  <option value="WHITELIST">Only</option>
                </StyledFormControl>
                <MultiInput
                  name="set:search.crowdAggs.selected.values"
                  options={this.getCrowdFields(view)}
                  placeholder="Add facet"
                  value={view.search.crowdAggs.selected.values}
                  onChange={e => this.handleAddMutation(e, view)}
                />
                <h3>Crowd aggs settings</h3>
                {crowdFields.map(field => (
                  <AggField
                    kind="crowdAggs"
                    key={field.name}
                    //@ts-ignore
                    field={field}
                    onAddMutation={this.handleAddMutation}
                    view={view}
                  />
                ))}
              </Col>
            </Row> */}
            <StyledButton onClick={this.handleSave(updateSiteView, view)}>
              Save Site View
            </StyledButton>
          </StyledContainer>
        )}
      </UpdateSiteViewMutation>
    );
  }
}

export default SearchForm;
