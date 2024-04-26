import React from 'react';
import { displayPrice } from './Util';
import { Avatar, Badge, Button, Card, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemText, Tooltip, Typography, autocompleteClasses } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';


const Cart = ({ removeFromCart, updateLineItem, removeOneItem, lineItems, cart, isVip, getItemsInCart }) => {
  const navigate = useNavigate();
  const cartItemDetails = getItemsInCart();

  const orderTotal = cartItemDetails?.reduce((total, cartItem) => {
    let itemPrice = cartItem.price;
    if (isVip && cartItem.vipPrice > 0) {
      itemPrice = cartItem.vipPrice;
    }

    return total + (itemPrice * cartItem.quantity)
  }, 0)

  const calculateLineItemTotal = (productPrice, vipPrice, quantity) => {
    if (isVip && vipPrice > 0) {
      return vipPrice * quantity
    } else {
      return productPrice * quantity
    }
  }
  const handleCheckout = (e) => {
    e.preventDefault();
    navigate(`/${cart.id}/checkout`)
  }
 
  return (
    <>
      <Typography variant="h5" gutterBottom sx={{ml: '12.5%'}}>
        Order summary
      </Typography>
      <List sx={{ maxWidth: '75%', ml: 'auto', mr: 'auto' }}>
        {cartItemDetails?.length ?
          cartItemDetails?.map((product) => {
            const currentLineItem = lineItems.find((lineItem) => { return lineItem.id === product.lineItemId })
            const isLastItemInCart = currentLineItem.quantity <= 1;
            return (
              <>
              
                <ListItem key={product.name} sx={{ py: 1, px: "1rem" }}>
                  <ListItemAvatar sx={{ mr: '1rem' }}>
                    <Badge
                      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                      badgeContent={product.quantity}
                      sx={{ "& .MuiBadge-badge": { backgroundColor: "accentPurple.main" } }}
                    >
                      <Avatar variant="square" src={product.productImage} alt={product.name} sx={{ width: '5rem', height: '5rem' }}></Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText sx={{ fontWeight: 600 }} primary={product.name} secondary={
                    <>
                      <Typography > {product.price}</Typography>
                      <Typography variant="caption" className="vipDiscount">
                        {product.vipPrice > 0 ? `${displayPrice.format(product.vipPrice)}  **VIP only discount!**` : ""}
                      </Typography>
                      <Tooltip title="Add one">
                        <IconButton aria-label="add" onClick={() => updateLineItem(currentLineItem)}>
                          <AddCircleIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={isLastItemInCart ? "Remove from cart" : "Remove one"}>
                        <IconButton aria-label="delete" onClick={() => { isLastItemInCart ? removeFromCart(currentLineItem) : removeOneItem(currentLineItem) }}>
                          {isLastItemInCart ? <RemoveShoppingCartIcon /> : <RemoveCircleIcon />}
                        </IconButton>
                      </Tooltip>
                    </>} />
                  <Typography variant="body2"> Total: {displayPrice.format(calculateLineItemTotal(product.price, product.vipPrice, product.quantity))}</Typography>
                </ListItem>
                <Divider variant="middle" component="li" />
              </>
            )
          })
          :
          <Card sx={{ mt: "1rem", p: "1rem" }} >
            <Typography>There are no items in the cart. Treat yourself with a cake ! Add your favourite cake to cart !</Typography>
          </Card>
        }
        <ListItem sx={{ py: 1, px: "1rem" }}>
          {
            ((!isVip&&cartItemDetails?.length>0) && 
            <Card sx={{ mt: "1rem", p: "1rem" }} >
              <Typography variant="body2" textAlign={"center"}>Make a purchase in-store to become a VIP member!</Typography>
            </Card>
            )
          }
          <ListItemText primary="Total: " inset primaryTypographyProps={{ sx: { width: "fit-content", fontWeight: 700, marginLeft: "auto", pr: "1rem" } }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {displayPrice.format(orderTotal)}
          </Typography>
        </ListItem>
      </List >
      <Button onClick={handleCheckout} variant='contained' sx={{ float: "right", px: "1rem", mb: "1rem", mt: "1rem", mr: "13%", fontWeight: "700" }}>Checkout</Button>
    </>
  );
};

export default Cart;
