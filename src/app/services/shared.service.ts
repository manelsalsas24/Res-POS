import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";
import { HttpClient } from "@angular/common/http";

// tumbnail data
export interface ThumbnailData {
  image: string;
  title: string;
  stock: number;
  price: number;
}

@Injectable({
  providedIn: "root",
})
export class SharedService {
  // API CALL SERVICE
  constructor(private http: HttpClient) {}

  // private apiUrl = "";  This is base url of api

  //Here is display product method.
  // Fetch categories from the API to display categories on filtermenu
  private categoriesSubject = new BehaviorSubject<any[]>([]);
  categories$ = this.categoriesSubject.asObservable();

  fetchCategories(tenantId: number): void {
    const url = `/api/Category/Category?tenantId=${tenantId}`;
    this.http.get<any[]>(url).subscribe(
      (data) => {
        this.categoriesSubject.next(data);
      },
      (error) => {
        console.error("Error fetching categories:", error);
      }
    );
  }

  // Fetch product thumbnails from the API to display product thumbnaiul according to filtermenu
  private productsSubject = new BehaviorSubject<any[]>([]);
  products$ = this.productsSubject.asObservable();

  fetchProducts(categoryId: number, tenantId: number): void {
    const url = `/api/Product/Product?category=${categoryId}&tenantId=${tenantId}`;
    this.http.get<any[]>(url).subscribe(
      (data) => {
        this.productsSubject.next(data);
      },
      (error) => {
        console.error("Error fetching products:", error);
      }
    );
  }

  // Thumbnail Holder when i click product thumbnail
  private thumbnailHolder = new BehaviorSubject<ThumbnailData | null>(null);
  thumbnail$ = this.thumbnailHolder.asObservable();

  setThumbnail(data: ThumbnailData) {
    this.thumbnailHolder.next(data);
  }

  clearThumbnail() {
    this.thumbnailHolder.next(null);
  }

  // Method to display product detail on orderlist
  private orderListSubject = new BehaviorSubject<any[]>([]);
  orderList$ = this.orderListSubject.asObservable();

  bags: { id: number; orderList: any[]; isActive: boolean }[] = [
    { id: 1, orderList: [], isActive: true },
  ];

  addToOrderList(product: any) {
    const currentOrders = this.orderListSubject.value;
    this.orderListSubject.next([...currentOrders, product]);
  }

  updateOrderList(orderList: any[]) {
    this.orderListSubject.next(orderList);
  }

  // Set total price and subscribed to deliverform.component
  private subtotalSubject = new BehaviorSubject<number>(0);
  subtotal$ = this.subtotalSubject.asObservable();

  private taxSubject = new BehaviorSubject<number>(0);
  tax$ = this.taxSubject.asObservable();

  private serviceFeeSubject = new BehaviorSubject<number>(0);
  serviceFee$ = this.serviceFeeSubject.asObservable();

  setPrices(subtotal: number, tax: number, serviceFee: number): void {
    this.subtotalSubject.next(subtotal);
    this.taxSubject.next(tax);
    this.serviceFeeSubject.next(serviceFee);
  }

  //Here is deliverform method.
  // Fetch customer from the API to display customers on select menu
  private customerSubject = new BehaviorSubject<any[]>([]);
  customers$ = this.customerSubject.asObservable();

  fetchCustomers(clientId: number, tenantId: number): void {
    const url = `/api/Customer/Customer?tenantId=${tenantId}&ClientId=${clientId}`;
    this.http.get<any[]>(url).subscribe(
      (data) => {
        this.customerSubject.next(data);
      },
      (error) => {
        console.error("Error fetching customers:", error);
      }
    );
  }

  // Create a new customer
  createCustomer(customerData: any): void {
    const url = `/api/Customer/CreateCustomer`;
    this.http.post(url, customerData).subscribe(
      (response) => {
        // Update the customer list with the new customer
        this.customerSubject.next([
          ...this.customerSubject.getValue(),
          response,
        ]);
      },
      (error) => {
        console.error("Error creating customer:", error);
      }
    );
  }

  // Fetch address from the API to display address according to customer
  private addressSubject = new BehaviorSubject<any[]>([]);
  addresses$ = this.addressSubject.asObservable();

  fetchAddresses(customerId: number): void {
    const url = `/api/Customer/Customer?tenantId=1&ClientId=${customerId}`;
    this.http.get<any[]>(url).subscribe(
      (data) => {
        const customer = data.find((c) => c.id === customerId);
        if (customer) {
          this.addressSubject.next(customer.listaEndereco);
        } else {
          this.addressSubject.next([]); // Clear addresses if no customer found
        }
      },
      (error) => {
        console.error("Error fetching addresses:", error);
      }
    );
  }

  // Fetch payment methods from the API to display methods on select menu
  private paymentMethodSubject = new BehaviorSubject<any[]>([]);
  paymentMethods$ = this.paymentMethodSubject.asObservable();

  fetchPaymentMethods(tenantId: number): void {
    const url = `/api/Payment/GetPaymentMethods?tenantId=${tenantId}`;
    this.http.get<any[]>(url).subscribe(
      (data) => {
        this.paymentMethodSubject.next(data);
      },
      (error) => {
        console.error("Error fetching payment methods:", error);
      }
    );
  }
}
