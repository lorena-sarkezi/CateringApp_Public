import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import AirportShuttleIcon from '@material-ui/icons/AirportShuttle';
import BusinessIcon from '@material-ui/icons/Business';

import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';

function ListItemLink(props) {
    const { icon, primary, to } = props;

    const renderLink = React.useMemo(
        () => React.forwardRef((itemProps, ref) => <RouterLink to={to} ref={ref} {...itemProps} />),
        [to],
    );

    return (
        <li>
            <ListItem button component={renderLink} >
                {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
                <ListItemText primary={primary} style={listItemTextFont} disableTypography />
            </ListItem>
        </li>
    );
}

ListItemLink.propTypes = {
    icon: PropTypes.element,
    primary: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
};

const useStyles = makeStyles({
    root: {
        width: 360,
    },
});

const listItemTextFont = {
    fontSize: "2em"
};

export default function ListItems() {
    return (
        <div>
            <List >
                <ListItemLink primary="Popis Cateringa" to="/" icon={<DashboardIcon />} />
            
                <ListItemLink primary="Administracija" to="/orders" icon={<BusinessIcon />} />

                <ListItemLink primary="Zaposlenici" to="/employees" icon={<PeopleIcon />} />

                <ListItemLink primary="Vozila" to="/orders" icon={<AirportShuttleIcon />} />


            </List>

        </div>
    )
};
  