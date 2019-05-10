import * as React from 'react';
import styled from 'styled-components';
import { FormControl } from 'react-bootstrap';
import { SiteViewFragment_search_aggs_fields } from 'types/SiteViewFragment';
import AggDropDown from 'containers/AggDropDown';
import { reject, equals } from 'ramda';
import { AggKind } from 'containers/SearchPage/shared';
import { camelCase, capitalize } from 'utils/helpers';

interface AggFieldProps {
  kind: 'aggs' | 'crowdAggs';
  field: SiteViewFragment_search_aggs_fields;
  onAddMutation: (e: { currentTarget: { name: string; value: any } }) => void;
}

interface AggFieldState {
  isValuesOpen: boolean;
}

const FiltersContainer = styled.div`
  display: flex;
`;

const FilterContainer = styled.div`
  flex: 3 1 0;
  .panel-heading {
    padding: 4px 15px;
  }
`;

const StyledKind = styled(FormControl)`
  flex: 1 1 0;
  margin-left: 15px;
`;

const StyledLabel = styled.label`
  color: white;
`;

const Container = styled.div`
  background: rgba(255, 255, 255, 0.2);
  padding: 10px;
`;

const StyledFormControl = styled(FormControl)`
  margin-bottom: 20px;
`;

class AggField extends React.Component<AggFieldProps, AggFieldState> {
  state: AggFieldState = {
    isValuesOpen: false,
  };

  getPath = () => `search.${this.props.kind}.fields.${this.props.field.name}`;

  handleAddFilter = (aggName: string, aggValue: string, isCrowd: boolean) => {
    this.props.onAddMutation({
      currentTarget: {
        name: `set:${this.getPath()}.preselected.values`,
        value: [...this.props.field.preselected.values, aggValue],
      },
    });
  };

  handleRemoveFilter = (
    aggName: string,
    aggValue: string,
    isCrowd: boolean,
  ) => {
    this.props.onAddMutation({
      currentTarget: {
        name: `set:${this.getPath()}.preselected.values`,
        value: reject(equals(aggValue), this.props.field.preselected.values),
      },
    });
  };

  handleOpen = (agg: string, aggKind: AggKind) => {
    this.setState({ isValuesOpen: !this.state.isValuesOpen });
  };

  render() {
    const selected = new Set(this.props.field.preselected.values);
    return (
      <>
        <h4>
          {this.props.field.name
            .split('_')
            .map(capitalize)
            .join(' ')}
        </h4>
        <Container>
          <StyledLabel>Preselected values</StyledLabel>
          <FiltersContainer>
            <FilterContainer>
              <AggDropDown
                agg={this.props.field.name}
                aggKind={this.props.kind}
                searchParams={{
                  q: ({ key: 'AND', children: [] } as unknown) as string[],
                  page: 0,
                  pageSize: 25,
                  aggFilters: [],
                  crowdAggFilters: [],
                  sorts: [],
                }}
                isOpen={this.state.isValuesOpen}
                selectedKeys={selected}
                addFilter={this.handleAddFilter}
                removeFilter={this.handleRemoveFilter}
                onOpen={this.handleOpen}
              />
            </FilterContainer>

            {/* <StyledKind
              name={`set:${this.getPath()}.preselected.kind`}
              componentClass="select"
              onChange={this.props.onAddMutation}
              defaultValue={this.props.field.preselected.kind}
              disabled
            >
              <option value="BLACKLIST">All except</option>
              <option value="WHITELIST">Only</option>
            </StyledKind> */}
          </FiltersContainer>
          <div>
            <StyledLabel>Order</StyledLabel>
            <StyledFormControl
              name={`set:${this.getPath()}.rank`}
              placeholder="Order"
              value={this.props.field.rank}
              onChange={this.props.onAddMutation}
            />
          </div>
        </Container>
      </>
    );
  }
}

export default AggField;
