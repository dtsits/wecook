// Wait for the DOM to be ready
$(document).ready(function () {
    // Fetch and display orders when the page loads
    fetchOrders('all');

    // Add event listener to the filter select
    $('#filterSubmitted').change(function () {
        const filterValue = $(this).val();
        fetchOrders(filterValue);
    });

    // Periodically fetch and display orders
    setInterval(function () {
        fetchOrders($('#filterSubmitted').val());
    }, 5000); // Adjust the interval as needed (5000 milliseconds = 5 seconds)


    function fetchOrders(filter) {
        $.get('/api/orders', { filter }, function (data) {
            const ordersTable = $('#ordersTable');
            ordersTable.empty(); // Clear the existing table rows
            data.forEach(function (order) {
                const formattedText = order.text.replace(/\n/g, '<br>');
                const row = `
                    <tr>
                        <td>${order.date}</td>
                        <td class='text-col'>${formattedText}</td>
                        <td class='bold-column'>
                            <select class="form-control submitted" data-orderid="${order._id}">
                                <option value="true" ${order.submitted ? 'selected' : ''}>Submitted</option>
                                <option value="false" ${!order.submitted ? 'selected' : ''}>Not Submitted</option>
                            </select>
                        </td>
                    </tr>
                `;
                ordersTable.append(row);


            });
        });
    }

    // Add event listener for changing the "submitted" dropdown
    $('#ordersTable').on('change', '.submitted', function () {
        const id = $(this).data('orderid');


        const submitted = $(this).val() === 'true';
        console.log('hoiiii');
        console.log(id);
        updateSubmitted(id, submitted);
    });

    function updateSubmitted(id, submitted) {
        $.ajax({
            url: `/api/orders/${id}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({ submitted: submitted }), // Include the 'submitted' property
            success: function (data) {
                // Order updated successfully
            },
            error: function (xhr, status, error) {
                console.error(error);
            },
        });
    }


});
